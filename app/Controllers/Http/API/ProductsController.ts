import { Product } from 'App/Models'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductsController {
  public async index ({ request, response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const products = await Product.query()
        // Load wishlist data if requested.
        .match([
          user?.id && request.input('with', []).includes('products.wishlist'),
          query => query.preload('wishlists', builder => builder.where('user_id', user.id)),
        ])
        // Load product media if requested.
        .match([
          request.input('with', []).includes('products.media'),
          query => query.preload('media'),
        ])
        // Load product ingredients if requested.
        .match([
          request.input('with', []).includes('products.ingredients'),
          query => query.preload('ingredients'),
        ])
        // Load product reviews if requested.
        .match([
          request.input('with', []).includes('products.reviews'),
          query => query.preload('reviews'),
        ])
        // Calculate reviews average if requested.
        .match([
          request.input('with', []).includes('products.reviews-avg'),
          query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('averate_rating')),
        ])

        // Filter products based on categories.
        .match([
          request.input('categories', []).length,
          query => query.whereHas('categories', (builder) => builder
            .whereInPivot('category_id', request.input('categories', []))),
        ])
        // Load product from a keyword
        .match([
          request.input('search', null),
          query => query.whereLike('name', `%${ request.input('search') }%`)
            .orWhereLike('description', `%${ request.input('search') }%`),
        ])
        .orderBy('id', 'desc')
        .paginate(request.input('page'), request.input('limit', 10))

      response.status(200).json(products)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show ({ request, params: { id }, auth, response }) {
    try {
      const user = auth.use('api').user

      const product = await Product.query()
        // Load product media if requested.
        .match([
          request.input('with', []).includes('product.media'),
          query => query.preload('media'),
        ])
        // Load product ingredients if requested.
        .match([
          request.input('with', []).includes('product.ingredients'),
          query => query.preload('ingredients'),
        ])
        // Load product reviews if requested.
        .match([
          request.input('with', []).includes('product.reviews'),
          query => query.preload('reviews'),
        ])
        // Load wishlist data if requested.
        .match([
          user?.id && request.input('with', []).includes('product.wishlist'),
          query => query.preload('wishlists', builder => builder.where('user_id', user.id)),
        ])
        // Calculate reviews average if requested.
        .match([
          request.input('with', []).includes('product.reviews-avg'),
          query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('averate_rating')),
        ])
        .where('id', id).firstOrFail()

      response.status(200).json(product)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }

  public async toggleCategory ({ params: { id }, response, request }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    const test = await product.related('categories').attach(request.input('category_id'))

    response.json(test)
  }
}
