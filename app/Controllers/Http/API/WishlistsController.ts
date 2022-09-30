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

    const wishlist = await user.related('wishlist').firstOrCreate(
      { userId: user.id }, // Search payload
      { ipAddress: request.ip() } // Save payload
    )

    await wishlist.load('products', (queryBuilder) => {
      queryBuilder.preload('media', (builder) => {
        builder.select('id')
      })
    })
    await wishlist.load('ingredients')

    response.json(wishlist)
  }

  /**
   * Update user wishlist.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!

    const wishlist = await user.related('wishlist').firstOrCreate(
      { userId: user.id }, // Search payload
      { ipAddress: request.ip() } // Save payload
    )

    // Add products to wishlist.
    if (request.input('action') === 'ADD') {
      await this.syncToWishlist(request, wishlist)
    }

    // Remove products from wishlist.
    if (request.input('action') === 'REMOVE') {
      await this.detachFromWishlist(request, wishlist)
    }

    await wishlist.load('products')
    await wishlist.load('ingredients')

    response.json(wishlist)
  }

  /**
   * Synchronize products with wishlist.
   *
   * @param request RequestContract
   * @param wishlist wishlist
   */
  protected async syncToWishlist (request: RequestContract, wishlist: Wishlist) {
    // Add products to wishlist
    if (request.input('products')) {
      await wishlist.related('products').sync(request.input('products'), false)
    }

    // Add ingredients to wishlist
    if (request.input('ingredients')) {
      await wishlist.related('ingredients').sync(request.input('ingredients'), false)
    }
  }

  /**
   * Remove products from wishlist.
   *
   * @param request RequestContract
   * @param wishlist Wishlist
   */
  protected async detachFromWishlist (request: RequestContract, wishlist: Wishlist) {
    // Remove products from wishlist.
    if (request.input('products')) {
      await wishlist.related('products').detach(request.input('products'))
    }

    // Remove products from wishlist.
    if (request.input('ingredients')) {
      await wishlist.related('ingredients').detach(request.input('ingredients'))
    }
  }
}
