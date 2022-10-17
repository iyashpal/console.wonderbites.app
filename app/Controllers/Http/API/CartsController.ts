import { User, Cart } from 'App/Models'
import { types } from '@ioc:Adonis/Core/Helpers'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CartsController {
  /**
   * Authenticate the user.
   * 
   * @param auth {AuthContract}
   */
  private async authenticate (auth: AuthContract): Promise<User | undefined> {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      return auth.use('api').user!
    }
  }

  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    const user = await this.authenticate(auth)

    const { id } = await this.cart(request, user)

    const cart = await Cart.query()
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
        query => query.preload('products', products => products
          .match([
            request.input('with', []).includes('cart.products.media'),
            query => query.preload('media'),
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
      .where('id', id).first()

    response.json(cart)
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    const user = await this.authenticate(auth)

    const cart = await this.cart(request, user)

    // Add products to cart.
    if (request.input('action') === 'ADD') {
      await this.addToCart(request, cart)
    }

    // Remove products from cart.
    if (request.input('action') === 'REMOVE') {
      await this.removeFromCart(request, cart)
    }

    await cart.load('ingredients')

    await cart.load('products', (builder) => builder.preload('media').orderBy('id'))

    response.json(cart)
  }

  /**
   * Get cart of current loggedin/guest user.
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
      await cart.related('ingredients').sync(request.input('ingredients'), false)
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

      await cart.related('ingredients').query().whereIn('product_id', request.input('products')).delete()
    }

    // Remove ingredients from cart.
    if (request.input('ingredients')) {
      await cart.related('ingredients').detach(request.input('ingredients'))
    }
  }
}
