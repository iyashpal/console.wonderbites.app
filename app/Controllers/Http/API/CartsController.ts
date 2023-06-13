import { v4 as uuid } from 'uuid'
import {User, Cart} from 'App/Models'
import {types} from '@ioc:Adonis/Core/Helpers'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/API/Carts/UpdateValidator'

export default class CartsController {
  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const cart = await this.cartWithRequestedData(request, await this.cart(request, user))

      response.ok(cart)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const { data } = await request.validate(UpdateValidator)

      let cart = await this.cart(request, user)

      await cart.merge({ data }).save()

      response.ok(cart)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
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
      const cart = await Cart.query()
        .whereNull('user_id').where('id', request.header('X-Cart-ID', 0))
        .where('session_id', request.header('X-Cart-Session', 0)).first()

      if (types.isNull(cart)) {
        return await Cart.create({ session_id: request.header('X-Cart-Session', uuid()) })
      }

      return cart
    }

    await user.load('cart')

    if (types.isNull(user.cart)) {
      return await user.related('cart').create({session_id: request.header('X-Cart-Session', uuid())})
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
            request.input('with', []).includes('cart.products.category'),
            query => query.preload('categories'),
          ])
          .match([
            request.input('with', []).includes('cart.products.ingredients'),
            query => query.preload('ingredients', ingredients => ingredients
              .match([
                request.input('with', []).includes('cart.products.ingredients.categories'),
                builder => builder.preload('categories'),
              ])
            ),
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
