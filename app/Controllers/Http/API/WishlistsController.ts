import {Wishlist} from 'App/Models/index'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class WishlistsController {
  /**
   * Show user wishlist.
   *
   * @param param0 HttpContextContract Request payload
   */
  public async show ({auth, response, request}: HttpContextContract) {
    const user = auth.use('api').user!

    const wishlist = await user.related('wishlist').firstOrCreate(
      {userId: user.id}, // Search payload
      {ipAddress: request.ip()} // Save payload
    )

    await wishlist.load('products')

    response.json(await this.wishlistWithRequestedData(request, wishlist.id))
  }

  /**
   * Update user wishlist.
   *
   * @param param0 {HttpContextContract} Request payload.
   */
  public async update ({auth, response, request}: HttpContextContract) {
    const user = auth.use('api').user!

    const wishlist = await user.related('wishlist').firstOrCreate(
      {userId: user.id}, // Search payload
      {ipAddress: request.ip()} // Save payload
    )

    // Add products to wishlist.
    if (request.input('action') === 'ADD') {
      await this.syncToWishlist(request, wishlist)
    }

    // Remove products from wishlist.
    if (request.input('action') === 'REMOVE') {
      await this.detachFromWishlist(request, wishlist)
    }

    response.json(await this.wishlistWithRequestedData(request, wishlist.id))
  }

  /**
   * Remove everything from the wishlist.
   *
   * @param param0 HttpContextContract
   */
  public async clean ({auth, request, response}: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const wishlist = await user.related('wishlist').firstOrCreate(
        {userId: user.id}, // Search payload
        {ipAddress: request.ip()} // Save payload
      )

      await wishlist.related('products').sync([])

      response.json(await this.wishlistWithRequestedData(request, wishlist.id))
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Get the wishlist requested data.
   *
   * @param request RequestContract
   * @param id number
   * @returns Wishlist
   */
  protected async wishlistWithRequestedData (request: RequestContract, id: number) {
    return await Wishlist.query().match([
      request.input('with', []).includes('wishlist.products'),
      query => query.preload('products', builder => builder
        // Load product ingredients if requested.
        .match([
          request.input('with', []).includes('wishlist.products.ingredients'),
          query => query.preload('ingredients'),
        ])

        // Load product reviews if requested.
        .match([
          request.input('with', []).includes('wishlist.products.reviews'),
          query => query.preload('reviews'),
        ])

        // Load product reviews count
        .match([
          request.input('withCount', []).includes('wishlist.products.reviews'),
          query => query.withCount('reviews'),
        ])

        // Calculate reviews average if requested.
        .match([
          request.input('withAvg', []).includes('wishlist.products.reviews'),
          query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
        ])
      ),
    ]).where('id', id).first()
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
  }
}
