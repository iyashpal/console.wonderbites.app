import { Order } from 'App/Models'
import { OrderStatus } from 'App/Models/Enums/Order'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrdersController {
  public async index ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!
    try {
      const orders = await user.related('orders').query()

        // Load order products if they are requested
        .match([
          request.input('with', []).includes('order.products'),
          query => query.preload('products', (builder) => builder.match([
            request.input('with', []).includes('order.products.media'),
            query => query.preload('media'),
          ])),
        ])

        // Load order user if they are requested.
        .match([request.input('with', []).includes('order.user'), query => query.preload('user')])

        // Load order coupons if they are requested.
        .match([request.input('with', []).includes('order.coupon'), query => query.preload('coupon')])

        // Load order reviews if requested.
        .match([request.input('with', []).includes('order.review'), query => query.preload('review')])

        // Load order address if they are requested.
        .match([request.input('with', []).includes('order.address'), query => query.preload('address')])

        // Load order ingredients if they are requested.
        .match([request.input('with', []).includes('order.ingredients'), query => query.preload('ingredients')])

        // Load orders by the status provided.
        .match(
          [request.input('status') === 'upcoming', query => query.where('status', OrderStatus.UPCOMING)],
          [request.input('status') === 'preparing', query => query.where('status', OrderStatus.PREPARING)],
          [request.input('status') === 'delivered', query => query.where('status', OrderStatus.DELIVERED)],
          [request.input('status') === 'canceled', query => query.where('status', OrderStatus.CANCELED)],
        )
        // group orders
        .orderBy(request.input('orderBy', 'created_at'), request.input('order', 'desc'))

        // Paginate orders
        .paginate(request.input('page', 1), request.input('limit', 50))

      response.json(orders)
    } catch (error) {
      response.badRequest({ message: 'Server error' })
    }
  }

  public async show ({ params, request, response }: HttpContextContract) {
    try {
      const order = await Order.query()
        // Load products if it is requested
        .match([
          request.input('with', []).includes('order.products'),
          query => query.preload('products', (builder) => builder.match([
            // Load product media if it is requested in query string.
            request.input('with', []).includes('order.products.media'),
            query => query.preload('media'),
          ]).match([
            // Load product ingredients if it is requested in query string.
            request.input('with', []).includes('order.products.ingredients'),
            query => query.preload('ingredients'),
          ])),
        ])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.user'), query => query.preload('user')])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.coupon'), query => query.preload('coupon')])

        // Load order reviews if requested.
        .match([request.input('with', []).includes('order.review'), query => query.preload('review')])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.address'), query => query.preload('address')])

        // Load order ingredients if requested
        .match([request.input('with', []).includes('order.ingredients'), query => query.preload('ingredients')])

        .where('id', params.id).firstOrFail()

      response.json(order)
    } catch (error) {
      response.notFound({ message: 'Not found' })
    }
  }

  /**
   * Cancel user orders.
   * 
   * @param param0 {HttpContextContract}
   */
  public async cancel ({ auth, params: { id }, response }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const order = await user.related('orders').query().where('id', id).firstOrFail()

      console.log(order.createdAt.diffNow().minutes)

      await order.merge({ status: OrderStatus.CANCELED }).save()
        .then(order => response.ok(order))
    } catch (error) {
      response.notFound(error)
    }
  }
}
