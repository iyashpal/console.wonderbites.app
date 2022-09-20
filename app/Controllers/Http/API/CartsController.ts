import { User, Cart } from 'App/Models'
import { AuthContract } from '@ioc:Adonis/Addons/Auth'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { isNull, isUndefined } from '@poppinss/utils/build/src/Helpers/types'

export default class CartsController {
  /**
   * Authenticate the user.
   * 
   * @param auth {AuthContract}
   */
  private async authenticate (auth: AuthContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await auth.use('api').authenticate()
    }
  }

  /**
   * Show logged-in/guest user cart.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    await this.authenticate(auth)

    const cart = await this.cart(request, auth.use('api').user!)

    await cart.load('products', (builder) => builder.preload('media').orderBy('id'))

    await cart.load('ingredients')

    response.json(cart)
  }

  /**
   * Update logged in/guest user cart.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    await this.authenticate(auth)

    const cart = await this.cart(request, auth.use('api').user!)

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
  protected async cart (request: RequestContract, user: User): Promise<Cart> {
    if (isNull(user) || isUndefined(user)) {
      const guestCart = await Cart.query().whereNull('user_id')
        .where('ip_address', request.ip()).first()

      if (isNull(guestCart)) {
        return await Cart.create({ ipAddress: request.ip() })
      }

      return guestCart
    }

    await user.load('cart')

    if (isNull(user.cart)) {
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
