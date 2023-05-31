import {Builder} from './index'
import {Product} from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ExtraFieldName} from 'App/Models/Enums/ExtraField'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class ProductQuery extends Builder<ModelQueryBuilderContract<typeof Product, Product>> {
  constructor (protected $request: RequestContract) {
    super($request)

    this.mapQueries(this, Product.query())
  }

  /**
   * Preload the product variants.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadVariants (): ProductQuery {
    this.$builder.match([
      this.input('with', []).includes(this.qs('variants')),
      productQuery => productQuery
        .preload('variants',
          variantsQuery => variantsQuery
            .match([
              this.input('with', []).includes(this.qs('variants.attributes')),
              attributeQuery => attributeQuery.preload('attributes'),
            ])
        ),
    ])

    return this
  }

  /**
   * Preload the Product categories.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadCategories (): ProductQuery {
    this.$builder.match([
      this.input('with', []).includes(this.qs('categories')),
      productQuery => productQuery.preload('categories'),
    ])
    return this
  }

  /**
   * Preload the product state in user wishlist.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadUserWishlist (): ProductQuery {
    this.$builder.match([
      this.user().id && this.input('with', []).includes(this.qs('wishlist')),
      query => query
        .preload('wishlists', builder => builder.where('user_id', this.user().id ?? 0)),
    ])
    return this
  }

  /**
   * Preload the product media.
   *
   * @returns ProductQuery
   */
  protected preloadMedia (): ProductQuery {
    this.$builder.match([
      this.input('with', []).includes(this.qs('media')),
      query => query.preload('media', builder => builder.orderBy('pivot_order')),
    ])

    return this
  }

  /**
   * Preload the product reviews.
   *
   * @returns ProductQuery
   */
  protected preloadReviews (): ProductQuery {
    this.$builder.match([
      this.input('with', []).includes(this.qs('reviews')),
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
    this.$builder.match([
      this.input('with', []).includes(this.qs('ingredients')),
      query => query
        .preload('ingredients', builder => builder
          .match([
            this.input('with', []).includes(this.qs('ingredients.categories')),
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
  protected filterInCategories (): ProductQuery {
    this.$builder.match([
      this.input('inCategories', []).length,
      query => query.whereHas('categories', (builder) => builder
        .whereInPivot('category_id', this.input('inCategories', []))),
    ])

    return this
  }

  /**
   * Filter products by search keyword.
   *
   * @returns ProductQuery
   */
  protected filterSearch (): ProductQuery {
    this.$builder.match([
      this.input('search', null),
      query => query.whereLike('name', `%${this.input('search')}%`)
        .orWhereLike('description', `%${this.input('search')}%`),
    ])

    return this
  }

  /**
   * Filter products based on rating.
   *
   * @returns ProductQuery
   */
  protected filterTopRated () {
    this.$builder.match([
      this.input('filters', []).includes('top-rated'),
      query => {
        let AvgReviews = Database.from('reviews')
          .avg('rating').where('reviewable', 'Product')
          .whereRaw('reviewable_id=products.id').as('avg_reviews')

        return query.from(Database.from('products')
          .select('*', AvgReviews).as('products'))
          .where('products.avg_reviews', '>=', 5)
      },
    ])

    return this
  }

  /**
   * Filter products based on today's pick.
   *
   * @returns ProductQuery
   */
  protected filterTodaysPick () {
    this.$builder.match([
      this.input('filters', []).includes(ExtraFieldName.TODAYS_PICK),
      query => query.whereHas('extraFields', builder => builder
        .where('field', ExtraFieldName.TODAYS_PICK).where('data', 'true')),
    ])

    return this
  }

  /**
   * Filter products based on product popularity state.
   *
   * @returns ProductQuery
   */
  protected filterPopular () {
    this.$builder.match([
      this.input('filters', []).includes(ExtraFieldName.POPULAR),
      query => query.where('is_popular', true),
    ])

    return this
  }

  /**
   * Preload the product counts.
   *
   * @returns ProductQuery
   */
  protected countReviews (): ProductQuery {
    this.$builder.match([
      this.input('withCount', []).includes(this.qs('reviews')),
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
    this.$builder.match([
      this.input('withAvg', []).includes(this.qs('reviews')),
      query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
    ])

    return this
  }
}
