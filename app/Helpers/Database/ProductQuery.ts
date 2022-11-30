import { Query } from '.'
import { Product } from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class ProductQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Product, Product>

  constructor (protected $request: RequestContract) {
    super($request)
    this.$query = Product.query()
  }

  /**
   * Preload the product state in user wishlist.
   * 
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadUserWishlist (): ProductQuery {
    this.$query.match([
      this.$auth?.id && this.$request.input('with', []).includes(`${this.$prefix}.wishlist`),
      query => query.preload('wishlists', builder => builder.where('user_id', this.$auth?.id ?? 0)),
    ])
    return this
  }

  /**
   * Preload the product media.
   * 
   * @returns ProductQuery
   */
  protected preloadMedia (): ProductQuery {
    this.$query.match([
      this.$request.input('with', []).includes(`${this.$prefix}.media`),
      query => query.preload('media'),
    ])

    return this
  }

  /**
   * Preload the product reviews.
   * 
   * @returns ProductQuery
   */
  protected preloadReviews (): ProductQuery {
    this.$query.match([
      this.$request.input('with', []).includes(`${this.$prefix}.reviews`),
      query => query.preload('reviews'),
    ])

    return this
  }

  /**
   * Preload the product ingredients.
   * 
   * @returns ProductQuery
   */
  protected preloadIngredients (): ProductQuery {
    this.$query.match([
      this.$request.input('with', []).includes(`${this.$prefix}.ingredients`),
      query => query.preload('ingredients', builder => builder.match([
        this.$request.input('with', []).includes(`${this.$prefix}.ingredients.categories`),
        query => query.preload('categories'),
      ])),
    ])
    return this
  }

  /**
   * Filter products by categories.
   * 
   * @returns ProductQuery
   */
  protected filterByCategories (): ProductQuery {
    this.$query.match([
      this.$request.input('inCategories', []).length,
      query => query.whereHas('categories', (builder) => builder
        .whereInPivot('category_id', this.$request.input('categories', []))),
    ])
    return this
  }

  /**
   * Filter products by search keyword.
   * 
   * @returns ProductQuery
   */
  protected filterSearch (): ProductQuery {
    this.$query.match([
      this.$request.input('search', null),
      query => query.whereLike('name', `%${this.$request.input('search')}%`)
        .orWhereLike('description', `%${this.$request.input('search')}%`),
    ])

    return this
  }

  /**
   * Filter products based on rating.
   * 
   * @returns ProductQuery
   */
  protected filterTopRated () {
    const AvgReviews = Database.from('reviews')
      .avg('rating').where('type', 'Product')
      .whereRaw('type_id=`products`.`id`').as('avg_reviews')

    this.$query
      .from(Database.from('products').select('*', AvgReviews).as('products'))
      .where('products.avg_reviews', '>=', 5)

    return this
  }

  /**
   * Preload the product counts.
   * 
   * @returns ProductQuery
   */
  protected countReviews (): ProductQuery {
    this.$query.match([
      this.$request.input('withCount', []).includes(`${this.$prefix}.reviews`),
      query => query.withCount('reviews'),
    ])
    return this
  }

  /**
   * Aggregate the product reviews.
   * 
   * @returns ProductQuery
   */
  protected aggregateReviews (): ProductQuery {
    this.$query.match([
      this.$request.input('withAvg', []).includes(`${this.$prefix}.reviews`),
      query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
    ])
    return this
  }
}
