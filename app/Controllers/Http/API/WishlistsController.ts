import Wishlist from 'App/Models/Wishlist'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WishlistsController {
  /**
   * Show user wishlist.
   * 
   * @param param0 HttpContextContract Request payload
   */
  public async show ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!

    const wishlist = await user.related('wishlist').firstOrCreate({ ipAddress: request.ip() })

    await wishlist.load('products')
    await wishlist.load('ingridients')

    response.json(wishlist)
  }

  /**
   * Update user wishlist.
   * 
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!

    const wishlist = await user.related('wishlist').firstOrCreate({ ipAddress: request.ip() })

    // Add products to cart.
    if (request.input('action') === 'SYNC') {
      await this.syncToWishlist(request, wishlist)
    }

    // Remove products from cart.
    if (request.input('action') === 'DETACH') {
      await this.detachFromWishlist(request, wishlist)
    }

    await wishlist.load('products')
    await wishlist.load('ingridients')

    response.json(wishlist)
  }

  /**
   * Synchronize products with cart.
   * 
   * @param request RequestContract 
   * @param cart Cart
   */
  protected async syncToWishlist (request: RequestContract, wishlist: Wishlist) {
    // Add products to cart
    if (request.input('products')) {
      await wishlist.related('products').sync(request.input('products'), false)
    }

    // Add ingridients to cart
    if (request.input('ingridients')) {
      await wishlist.related('ingridients').sync(request.input('ingridients'), false)
    }
  }

  /**
   * Remove products from wishlist.
   * 
   * @param request RequestContract
   * @param wishlist Wishlist
   */
  protected async detachFromWishlist (request: RequestContract, wishlist: Wishlist) {
    // Remove products from cart.
    if (request.input('products')) {
      await wishlist.related('products').detach(request.input('products'))
    }

    // Remove products from cart.
    if (request.input('ingridients')) {
      await wishlist.related('ingridients').detach(request.input('ingridients'))
    }
  }
}
