import {Builder} from './index'
import {Product} from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ExtraFieldName} from 'App/Models/Enums/ExtraField'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class ProductBuilder extends Builder<ModelQueryBuilderContract<typeof Product, Product>> {
  constructor (protected $request: RequestContract, $prefix?: string) {
    super($request, Product.query(), $prefix)
  }

  /**
   * Preload the product variants.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadVariants (): ProductBuilder {
    this.$builder.match([
      this._includes('with', 'variants'),
      productQuery => productQuery.preload('variants', this._preloadVariantAttributes),
    ])

    return this
  }

  /**
   * Preload variant attributes.
   *
   * @param builder ModelQueryBuilderContract<typeof Product, Product>
   */
  public _preloadVariantAttributes (builder) {
    builder.match([
      this._includes('with', 'variants.attributes'),
      query => query.preload('attributes', queryAttributes => {
        queryAttributes.select(this.selectColumnsOf('variants.attributes'))
      }),
    ])
  }

  /**
   * Preload the Product categories.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadCategories (): ProductBuilder {
    this.$builder.match([
      this._includes('with', 'categories'),
      productQuery => productQuery.preload('categories', queryCategories => {
        queryCategories.select(this.selectColumnsOf('categories'))
      }),
    ])
    return this
  }

  /**
   * Preload the product state in user wishlist.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  protected preloadUserWishlist (): ProductBuilder {
    this.$builder.match([
      this.user().id && this._includes('with', 'wishlist'),
      query => query.preload('wishlists', builder => {
        builder.select(this.selectColumnsOf('wishlist')).where('user_id', this.user().id ?? 0)
      }),
    ])
    return this
  }

  /**
   * Preload the product media.
   *
   * @returns ProductQuery
   */
  protected preloadMedia (): ProductBuilder {
    this.$builder.match([
      this._includes('with', 'media'),
      query => query.preload('media', builder => {
        builder.select(this.selectColumnsOf('media')).orderBy('pivot_order')
      }),
    ])

    return this
  }

  /**
   * Preload the product reviews.
   *
   * @returns ProductQuery
   */
  protected preloadReviews (): ProductBuilder {
    this.$builder.match([
      this._includes('with', 'reviews'),
      query => query.preload('reviews', queryReviews => {
        queryReviews.select(this.selectColumnsOf('reviews'))
      }),
    ])

    return this
  }

  /**
   * Preload the product ingredients.
   *
   * @returns ProductQuery
   */
  protected preloadIngredients (): ProductBuilder {
    this.$builder.match([
      this._includes('with', 'ingredients'),
      query => query.preload('ingredients', queryIngredients => {
        queryIngredients.match([
          this._includes('with', 'ingredients.categories'),
          query => query.preload('categories', queryCategory => {
            queryCategory.select(this.selectColumnsOf('ingredients.categories'))
          }),
        ])
      }),
    ])

    return this
  }

  /**
   * Filter products by categories.
   *
   * @returns ProductQuery
   */
  protected filterInCategories (): ProductBuilder {
    this.$builder.match([
      this.input('inCategories', []).length,
      query => query.whereHas('categories', (builder) => {
        builder.whereInPivot('category_id', this.input('inCategories', []))
      }),
    ])

    return this
  }

  /**
   * Filter products by search keyword.
   *
   * @returns ProductQuery
   */
  protected filterSearch (): ProductBuilder {
    this.$builder.match([
      this.input('search', ''),
      query => {
        query.whereLike('name', `%${this.input('search')}%`)
          .orWhereLike('description', `%${this.input('search')}%`)
      },
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
      this._includes('filters', 'top-rated', false),
      query => {
        let AvgReviews = Database.from('reviews')
          .avg('rating').where('reviewable', 'Product')
          .whereRaw('reviewable_id=products.id').as('avg_reviews')

        query.from(Database.from('products')
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
      this._includes('filters', ExtraFieldName.TODAYS_PICK, false),
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
      this._includes('filters', ExtraFieldName.POPULAR, false),
      query => query.where('is_popular', true),
    ])

    return this
  }

  /**
   * Preload the product counts.
   *
   * @returns ProductQuery
   */
  protected countReviews (): ProductBuilder {
    this.$builder.match([
      this._includes('withCount', 'reviews'),
      query => query.withCount('reviews'),
    ])

    return this
  }

  /**
   * Aggregate the product reviews.
   *
   * @returns ProductQuery
   */
  protected aggregateReviews (): ProductBuilder {
    this.$builder.match([
      this._includes('withAvg', 'reviews'),
      query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
    ])

    return this
  }
}
