import { User, Cart } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { isNull, isUndefined } from '@poppinss/utils/build/src/Helpers/types'

export default class CartsController {
  /**
   * Show loggedin/guest user cart.
   * 
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ request, auth, response }: HttpContextContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await auth.use('api').authenticate()
    }

    const cart = await this.cart(request, auth.use('api').user!)

    await cart.load('products', (builder) => builder.preload('media'))

    await cart.load('ingridients')

    response.json(cart)
  }

  /**
   * Update loggedin/guest user cart.
   * 
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await auth.use('api').authenticate()
    }

    const cart = await this.cart(request, auth.use('api').user!)

    // Add products to cart.
    if (request.input('action') === 'SYNC') {
      await this.syncToCart(request, cart)
    }

    // Remove products from cart.
    if (request.input('action') === 'DETACH') {
      await this.detachFromCart(request, cart)
    }

    await cart.load('products', (builder) => builder.preload('media'))

    await cart.load('ingridients')

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
  protected async syncToCart (request: RequestContract, cart: Cart) {
    // Add products to cart
    if (request.input('products')) {
      await cart.related('products').sync(request.input('products'), false)
    }

    // Add ingridients to cart
    if (request.input('ingridients')) {
      await cart.related('ingridients').sync(request.input('ingridients'), false)
    }
  }

  /**
   * Remove products from cart.
   * 
   * @param request RequestContract
   * @param cart Cart
   */
  protected async detachFromCart (request: RequestContract, cart: Cart) {
    // Remove products from cart.
    if (request.input('products')) {
      await cart.related('products').detach(request.input('products'))
    }

    // Remove products from cart.
    if (request.input('ingridients')) {
      await cart.related('ingridients').detach(request.input('ingridients'))
    }
  }
}
