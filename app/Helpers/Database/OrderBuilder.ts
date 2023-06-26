import {Builder} from './index'
import {Order} from 'App/Models'
import {OrderStatus} from 'App/Models/Enums/Order'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class OrderBuilder extends Builder<ModelQueryBuilderContract<typeof Order, Order>> {
  constructor (protected $request: RequestContract, $prefix?: string) {
    super($request, Order.query(), $prefix)
  }

  /**
   * Preload the order user.
   *
   * @returns OrderQuery
   */
  protected preloadUser (): this {
    this.$builder.match([
      this._includes('with', 'user'),
      orders => orders.preload('user', queryUser => queryUser.select(this.selectColumnsOf('user'))),
    ])

    return this
  }

  /**
   * Preload the used order coupon.
   *
   * @returns OrderQuery
   */
  protected preloadCoupon (): this {
    this.$builder.match([
      this._includes('with', 'coupon'),
      orders => orders.preload('coupon', queryCoupon => queryCoupon.select(this.selectColumnsOf('coupon'))),
    ])
    return this
  }

  /**
   * Preload the order review.
   *
   * @returns OrderQuery
   */
  protected preloadReview (): this {
    this.$builder.match([
      this._includes('with', 'review'),
      orders => orders.preload('review', queryReview => queryReview.select(this.selectColumnsOf('review'))),
    ])

    return this
  }

  /**
   * Filter orders based on status.
   *
   * @returns OrderQuery
   */
  protected filterStatus (): this {
    this.$builder.match(
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
