import {Builder} from './index'
import {Order} from 'App/Models'
import {OrderStatus} from 'App/Models/Enums/Order'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class OrderQuery extends Builder<ModelQueryBuilderContract<typeof Order, Order>> {
  constructor (protected $request: RequestContract) {
    super($request)

    this.mapQueries(this, Order.query())
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
   * Filter orders based on status.
   *
   * @returns OrderQuery
   */
  protected filterStatus (): this {
    this.$query.match(
      // Filter all past orders.
      [this.input('status') === 'past', query => query.whereIn('status', [
        OrderStatus.DELIVERED, OrderStatus.CANCELED,
      ])],

      // Filter all upcoming orders.
      [this.input('status') === 'upcoming', query => query.whereIn('status', [
        OrderStatus.PLACED, OrderStatus.CONFIRMED, OrderStatus.IN_TRANSIT, OrderStatus.PREPARING,
      ])],
      [this.input('status') === 'placed', query => query.where('status', OrderStatus.PLACED)],
      [this.input('status') === 'confirmed', query => query.where('status', OrderStatus.CONFIRMED)],
      [this.input('status') === 'preparing', query => query.where('status', OrderStatus.PREPARING)],
      [this.input('status') === 'in-transit', query => query.where('status', OrderStatus.IN_TRANSIT)],
      [this.input('status') === 'delivered', query => query.where('status', OrderStatus.DELIVERED)],
      [this.input('status') === 'canceled', query => query.where('status', OrderStatus.CANCELED)],
    )
    return this
  }
}
