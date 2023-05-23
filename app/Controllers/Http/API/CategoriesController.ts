import Category from 'App/Models/Category'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   *
   * @param param0 HttpContextContract
   */
  public async index ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      // Nested conditional query to load the categories data.
      const queryOnRequestInput = (query) => query

        // Load products if it is requested in query string.
        .match([
          request.input('with', []).includes('category.products'),
          query => query.preload('products', (builder) => builder
            // Load product media if it is requested in query string.
            .match([
              request.input('with', []).includes('category.products.media'),
              query => query.preload('media'),
            ])
            // Load product ingredients if requested.
            .match([
              request.input('with', []).includes('category.products.ingredients'),
              query => query.preload('ingredients'),
            ])
            // Load product reviews if requested.
            .match([
              request.input('with', []).includes('category.products.reviews'),
              query => query.preload('reviews'),
            ])
            .match([
              request.input('withAvg', []).includes('category.products.reviews'),
              query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
            ])
            // Load wishlist data if requested.
            .match([
              user?.id && request.input('with', []).includes('category.products.wishlist'),
              query => query.preload('wishlists', builder => builder.where('user_id', user.id)),
            ])
            // Load product from a keyword
            .match([
              request.input('searchable', []).includes('products'),
              query => query.whereLike('name', `%${request.input('search.products')}%`)
                .orWhereLike('description', `%${request.input('search.products')}%`),
            ])
          ),
        ])

        // Load ingredients if it is requested in query string.
        .match([
          request.input('with', []).includes('category.ingredients'),
          query => query.preload('ingredients'),
        ])

        // Load cuisines if it is requested in query string.
        .match([
          request.input('with', []).includes('category.cuisines'),
          query => query.preload('cuisines'),
        ])

      const category = await Category.query().match(
        [
          request.input('type') === 'variant',
          query => queryOnRequestInput(query.where('type', 'Variant')),
        ],
        [
          request.input('type') === 'product',
          query => queryOnRequestInput(query.where('type', 'Product')),
        ],
        [
          request.input('type') === 'ingredient',
          query => queryOnRequestInput(query.where('type', 'Ingredient')),
        ],
        [
          request.input('type') === 'cuisine',
          query => queryOnRequestInput(query.where('type', 'Cuisine')),
        ],
        [
          request.input('type') === 'blog',
          query => queryOnRequestInput(query.where('type', 'Blog')),
        ],
        [
          request.input('type', 'all') === 'all',
          queryOnRequestInput,
        ],
      )
        .match([
          request.input('searchable', []).includes('categories'),
          query => query.whereLike('name', `%${request.input('search')}%`),
        ])

      response.status(200).json(category)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ auth, response, params: { id }, request }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      // const category = await Category.findOrFail(id)
      const category = await Category.query()

        // Load products when endpoint contains with attribute.
        .match([
          request.input('with', []).includes('products'),
          query => query.preload('products', builder => builder.match([
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
            .match([
              request.input('withAvg', []).includes('products.reviews'),
              query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
            ])
            // Load wishlist data if requested.
            .match([
              user?.id && request.input('with', []).includes('products.wishlist'),
              query => query.preload('wishlists', builder => builder.where('user_id', user.id)),
            ])
            // Load product from a keyword
            .match([
              request.input('search', null),
              query => query.whereLike('name', `%${request.input('search')}%`)
                .orWhereLike('description', `%${request.input('search')}%`),
            ])
          ),
        ])
        // Load ingredients when endpoint contains with attribute.
        .match([
          request.input('with', []).includes('ingredients'),
          query => query.preload('ingredients'),
        ])
        // Load cuisines when endpoint contains with attribute.
        .match([
          request.input('with', []).includes('cuisines'),
          query => query.preload('cuisines'),
        ])
        .where('id', id).firstOrFail()

      response.status(200).json(category)
    } catch (error) {
      response.notFound({ message: 'Category Not Found' })
    }
  }
}
