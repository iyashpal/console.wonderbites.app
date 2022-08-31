import { Order } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrdersController {
  public async index ({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()
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
        // Load order ingredients if they are requested.
        .match([request.input('with', []).includes('order.ingredients'), query => query.preload('ingredients')])
        // Load order coupons if they are requested.
        .match([request.input('with', []).includes('order.coupon'), query => query.preload('coupon')])
        // Load order address if they are requested.
        .match([request.input('with', []).includes('order.address'), query => query.preload('address')])
        // Load order user if they are requested.
        .match([request.input('with', []).includes('order.user'), query => query.preload('user')])
        // Paginate orders
        .paginate(request.input('page', 1), request.input('limit', 10))

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
          ])),
        ])

        // Load order coupon if requested 
        .match([request.input('with', []).includes('order.ingredients'), query => query.preload('ingredients')])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.coupon'), query => query.preload('coupon')])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.address'), query => query.preload('address')])

        // Load order coupon if requested
        .match([request.input('with', []).includes('order.user'), query => query.preload('user')])

        .where('id', params.id).firstOrFail()

      response.json(order)
    } catch (error) {
      response.notFound({ message: 'Not found' })
    }
  }
}
