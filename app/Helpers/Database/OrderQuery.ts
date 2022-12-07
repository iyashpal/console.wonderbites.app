import Query from './Query'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'
import { Order } from 'App/Models'
import { OrderStatus } from 'App/Models/Enums/Order'

export default class OrderQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Order, Order>

  constructor (protected $request: RequestContract) {
    super($request)

    this.$query = Order.query()

    this.$counts.push(...[])

    this.$filters.push(...[])

    this.$aggregates.push(...[])

    this.$preloads.push(...['Products', 'Ingredients', 'User', 'Coupon', 'Review', 'Address'])

    this.$filters.push(...['Status'])
  }

  /**
   * Get the query instance.
   * 
   * @returns ModelQueryBuilderContract<typeof Order, Order>
   */
  public query (): ModelQueryBuilderContract<typeof Order, Order> {
    return this.$query
  }

  /**
   * Preload the order products.
   * 
   * @returns OrderQuery
   */
  protected preloadProducts (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('products')),
      query => query.preload('products', products => products

        .match([
          this.input('with', []).includes(this.qs('products.media')),
          query => query.preload('media'),
        ])

        .match([
          this.input('with', []).includes(this.qs('products.review')),
          review => review.where('user_id', this.user().id),
        ])

        .match([
          this.input('with', []).includes(this.qs('products.ingredients')),
          products => products.preload('ingredients', ingredients => ingredients.match([

            this.input('with', []).includes(this.qs('products.ingredients.categories')),
            ingredient => ingredient.preload('categories'),

          ])),
        ])
      ),
    ])

    return this
  }

  /**
   * Preload the order product ingredients.
   * 
   * @returns OrderQuery
   */
  protected preloadIngredients (): this {
    this.$query.match([

      this.input('with', []).includes(this.qs('ingredients')),
      orders => orders.preload('ingredients', ingredients => ingredients

        .match([
          this.input('with', []).includes(this.qs('ingredients.categories')),
          ingredient => ingredient.preload('categories'),
        ])

      ),

    ])

    return this
  }

  /**
   * Preload the order user.
   * 
   * @returns OrderQuery
   */
  protected preloadUser (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('user')),
      orders => orders.preload('user'),
    ])

    return this
  }

  /**
   * Preload the used order coupon.
   * 
   * @returns OrderQuery
   */
  protected preloadCoupon (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('coupon')),
      orders => orders.preload('coupon'),
    ])
    return this
  }

  /**
   * Preload the order review.
   * 
   * @returns OrderQuery
   */
  protected preloadReview (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('review')),
      orders => orders.preload('review'),
    ])

    return this
  }

  /**
   * Preload the user address.
   * 
   * @returns OrderQuery
   */
  protected preloadAddress (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('address')),
      orders => orders.preload('address'),
    ])

    return this
  }

  /**
   * Filter orders based on status.
   * 
   * @returns OrderQuery
   */
  protected filterStatus (): this {
    this.$query.match(
      [this.input('status') === 'upcoming', query => query.where('status', OrderStatus.UPCOMING)],
      [this.input('status') === 'preparing', query => query.where('status', OrderStatus.PREPARING)],
      [this.input('status') === 'delivered', query => query.where('status', OrderStatus.DELIVERED)],
      [this.input('status') === 'canceled', query => query.where('status', OrderStatus.CANCELED)],
    )
    return this
  }
}
