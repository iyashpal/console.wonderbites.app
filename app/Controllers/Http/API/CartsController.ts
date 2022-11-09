import { mapKeys, mapValues } from 'lodash'
import { types } from '@ioc:Adonis/Core/Helpers'
import { User, Cart, Product } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartsController {
  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    const user = auth.use('api').user!

    const cart = await this.cartWithRequestedData(request, await this.cart(request, user))

    response.json(cart)
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    let cart = await this.cart(request, user)

    // Add products to cart.
    if (request.input('action') === 'ADD') {
      await this.cleanCartBeforeUpdate(request, cart)

      await this.addToCart(request, cart)
    }

    // Remove products from cart.
    if (request.input('action') === 'REMOVE') {
      await this.removeFromCart(request, cart)
    }

    response.json(await this.cartWithRequestedData(request, cart))
  }

  /**
   * Add products to cart without customization.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async quick ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    let cart = await this.cart(request, user)

    await Product.findOrFail(request.input('products'))
      .then(async product => {
        await product?.load('ingredients')

        let mappedIngredients = mapValues(
          mapKeys(
            product?.ingredients.map(ingredient => ({
              id: ingredient.id,
              product_id: product.id,
              qty: ingredient.$extras.pivot_min_quantity,
              price: ingredient.$extras.pivot_price,
            })), (data) => data.id
          ),
          data => ({ product_id: data.product_id, qty: data.qty, price: data.price})
        )

        await cart.related('products').attach([product.id])

        await cart.related('ingredients').attach(mappedIngredients)
      })

    response.json(await this.cartWithRequestedData(request, cart))
  }

  /**
   * Get cart of current logged-in/guest user.
   *
   * @param request RequestContract
   * @param user User
   * @returns Cart
   */
  protected async cart (request: RequestContract, user: User | undefined): Promise<Cart> {
    if (types.isNull(user) || types.isUndefined(user)) {
      const guestCart = await Cart.query().whereNull('user_id')
        .where('ip_address', request.ip()).first()

      if (types.isNull(guestCart)) {
        return await Cart.create({ ipAddress: request.ip() })
      }

      return guestCart
    }

    await user.load('cart')

    if (types.isNull(user.cart)) {
      return await user.related('cart').create({ ipAddress: request.ip() })
    }

    return user.cart
  }

  /**
   * Synchronize products with cart.
   *
   * @param request RequestContract
   * @param cart Cart
   */
  protected async addToCart (request: RequestContract, cart: Cart) {
    // Add products to cart
    if (request.input('products')) {
      await cart.related('products').sync(request.input('products'), false)
    }

    // Add ingredients to cart
    if (request.input('ingredients')) {
      await cart.related('ingredients').attach(request.input('ingredients'))
    }
  }

  /**
   * Remove products from cart.
   *
   * @param request RequestContract
   * @param cart Cart
   */
  protected async removeFromCart (request: RequestContract, cart: Cart) {
    // Remove products from cart.
    if (request.input('products')) {
      await cart.related('products').detach(request.input('products'))

      await cart.related('ingredients').query()
        .whereInPivot('product_id', request.input('products')).delete()
    }

    // Remove ingredients from cart.
    if (request.input('ingredients')) {
      await cart.related('ingredients').detach(request.input('ingredients'))
    }
  }

  /**
   * Remove all ingredients from cart if the request is to update the cart.
   * 
   * @param request RequestContract
   * @param cart Cart
   */
  protected async cleanCartBeforeUpdate (request: RequestContract, cart: Cart) {
    // Clean ingredients only when we have ingredients in the list.
    if (Object.keys(request.input('ingredients', [])).length > 0) {
      await cart.related('ingredients').query()
        .whereInPivot('product_id', Object.keys(request.input('products', [])))
        .delete()
    }
  }

  /**
   * Get the cart with requested data.
   * 
   * @param request RequestContract
   * @param cart Cart
   * @returns Cart
   */
  protected async cartWithRequestedData (request: RequestContract, cart: Cart) {
    return await Cart.query()
      .match([
        request.input('with', []).includes('cart.user'),
        query => query.preload('user'),
      ])
      .match([
        request.input('with', []).includes('cart.coupon'),
        query => query.preload('coupon'),
      ])
      .match([
        request.input('with', []).includes('cart.products'),
        query => query.preload('products', products => products.orderBy('id', 'asc')
          .match([
            request.input('with', []).includes('cart.products.media'),
            query => query.preload('media'),
          ])
          .match([
            request.input('with', []).includes('cart.products.ingredients'),
            query => query.preload('ingredients'),
          ])
        ),
      ])
      .match([
        request.input('with', []).includes('cart.ingredients'),
        query => query.preload('ingredients', query => query.match([
          request.input('with', []).includes('cart.ingredients.categories'),
          query => query.preload('categories'),
        ])),
      ])
      .match([
        request.input('withCount', []).includes('cart.products'),
        query => query.withCount('products'),
      ])
      .match([
        request.input('withCount', []).includes('cart.ingredients'),
        query => query.withCount('ingredients'),
      ])
      .where('id', cart.id).first()
  }
}
