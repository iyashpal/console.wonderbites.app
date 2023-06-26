import { Builder } from '.'
import { Category, Product } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ManyToManyQueryBuilderContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type ProductQueryBuilder = ManyToManyQueryBuilderContract<typeof Product, any>

export default class CategoryBuilder extends Builder<ModelQueryBuilderContract<typeof Category, Category>> {
  constructor (protected $request: RequestContract, protected $prefix?: string) {
    super($request, Category.query(), $prefix)
  }

  protected whereCategoryType () {
    this.$builder.match([
      this.input('type', null) !== null,
      query => query.where('type', string.capitalCase(this.input('type'))),
    ])
  }

  protected preloadProducts () {
    this.$builder.match([
      this._includes('with', 'products'),
      query => query.preload('products', productQuery => {
        productQuery.select(this.selectColumnsOf('products'))
        this._whereProductsLike(productQuery)
        this._preloadProductMedia(productQuery)
        this._preloadProductReviews(productQuery)
        this._preloadProductWishlists(productQuery)
        this._preloadProductIngredients(productQuery)
        this._aggregateProductReviewsAvg(productQuery)
      }),
    ])
  }

  protected preloadIngredients () {
    this.$builder.match([
      this._includes('with', 'ingredients'),
      query => query.preload('ingredients', queryIngredients => {
        queryIngredients.select(this.selectColumnsOf('ingredients'))
      }),
    ])
  }

  protected preloadCuisines () {
    this.$builder.match([
      this._includes('with', 'cuisines'),
      query => query.preload('cuisines', queryCuisines => {
        queryCuisines.select(this.selectColumnsOf('cuisines'))
      }),
    ])
  }

  protected whereCategories () {
    this.$builder.match([
      this.input('search', null) !== null,
      query => query.where('name', 'like', `%${this.input('search')}%`),
    ])
  }

  protected _preloadProductMedia<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this._includes('with', 'products.media'),
      query => query.preload('media', mediaQuery => {
        mediaQuery.select(this.selectColumnsOf('products.media'))
      }),
    ])
  }

  protected _preloadProductIngredients<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this._includes('with', 'products.ingredients'),
      query => query.preload('ingredients', queryIngredients => {
        queryIngredients.select(this.selectColumnsOf('products.ingredients'))
      }),
    ])
  }

  protected _preloadProductReviews<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this._includes('with', 'products.reviews'),
      query => query.preload('reviews', queryReviews => {
        queryReviews.select(this.selectColumnsOf('products.reviews'))
      }),
    ])
  }

  protected _preloadProductWishlists<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this.$user?.id && this._includes('with', 'products.wishlist'),
      query => query.preload('wishlists', wishlists => wishlists.where('user_id', this.$user?.id ?? 0)),
    ])
  }

  protected _whereProductsLike<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this.input('searchable', [] as string[]).includes('products') && this.input('search', null) !== null,
      query => query.where('name', 'like', `%${this.input('search')}%`),
    ])
  }

  protected _aggregateProductReviewsAvg<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this.input('withAvg', [] as string[]).includes(this.__('products.reviews')),
      query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
    ])
  }
}
