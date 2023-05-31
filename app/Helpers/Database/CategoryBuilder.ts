import { Builder } from '.'
import { Category, Product } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ManyToManyQueryBuilderContract, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

type ProductQueryBuilder = ManyToManyQueryBuilderContract<typeof Product, any>

export default class CategoryBuilder extends Builder<ModelQueryBuilderContract<typeof Category, Category>> {
  constructor (protected $request: RequestContract, protected $prefix?: string) {
    super($request, $prefix)
    this.mapQueries(this, Category.query())
  }

  protected whereCategoryType () {
    this.$builder.match([
      this.input('type', null) !== null,
      query => query.where('type', string.capitalCase(this.input('type'))),
    ])
  }

  protected preloadProducts () {
    this.$builder.match([
      this.input('with', []).includes(this.qs('products')),
      query => query.preload('products', productQuery => {
        productQuery = this._whereProductsLike(productQuery)
        productQuery = this._preloadProductMedia(productQuery)
        productQuery = this._preloadProductReviews(productQuery)
        productQuery = this._preloadProductWishlists(productQuery)
        productQuery = this._preloadProductIngredients(productQuery)
        productQuery = this._aggregateProductReviewsAvg(productQuery)
        return productQuery
      }),
    ])
  }

  protected preloadIngredients () {
    this.$builder.match([
      this.input('with', []).includes(this.qs('ingredients')),
      query => query.preload('ingredients'),
    ])
  }

  protected preloadCuisines () {
    this.$builder.match([
      this.input('with', []).includes(this.qs('cuisines')),
      query => query.preload('cuisines'),
    ])
  }

  protected whereCategories () {
    this.$builder.match([
      this.input('search', null) !== null,
      query => query.whereLike('name', `%${this.input('search')}%`),
    ])
  }

  protected _preloadProductMedia<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this.input('with', []).includes(this.qs('products.media')),
      query => query.preload('media'),
    ])
  }

  protected _preloadProductIngredients<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this.input('with', []).includes(this.qs('products.ingredients')),
      query => query.preload('ingredients'),
    ])
  }

  protected _preloadProductReviews<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this.input('with', []).includes(this.qs('products.reviews')),
      query => query.preload('reviews'),
    ])
  }

  protected _preloadProductWishlists<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this.$user?.id && this.input('with', []).includes(this.qs('products.wishlist')),
      query => query.preload('wishlists', wishlists => wishlists.where('user_id', this.$user?.id ?? 0)),
    ])
  }

  protected _whereProductsLike<T extends ProductQueryBuilder>(builder: T) {
    return builder.match([
      this.input('searchable', []).includes('products') && this.input('search', null) !== null,
      query => query.whereLike('name', `%${this.input('search')}%`),
    ])
  }

  protected _aggregateProductReviewsAvg<T extends ProductQueryBuilder> (builder: T) {
    return builder.match([
      this.input('withAvg', []).includes(this.qs('products.reviews')),
      query => query.withAggregate('reviews', reviews => reviews.avg('rating').as('reviews_avg')),
    ])
  }
}
