import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Order } from 'App/Models'

export default class OrdersController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ auth, params, request, response }: HttpContextContract) {
    try {
      const order = await Order.query()
        .where('id', params.id)
        .match(
          [
            // Load products if it is requested
            request.input('with', []).includes('order.products'),
            query => query.preload('products', (builder) => builder.match([
              // Load product media if it is requested in query string.
              request.input('with', []).includes('order.products.media'),
              query => query.preload('media'),
            ])),
          ],
          [
            // Load order coupon if requested
            request.input('with', []).includes('order.ingredients'),
            query => query.preload('ingredients'),
          ],
          [
            // Load order coupon if requested
            request.input('with', []).includes('order.coupon'),
            query => query.preload('coupon'),
          ],
          [
            // Load order coupon if requested
            request.input('with', []).includes('order.address'),
            query => query.preload('address'),
          ],
          [
            // Load order coupon if requested
            request.input('with', []).includes('order.user'),
            query => query.preload('user'),
          ],
        )
        .firstOrFail()

      response.json(order)
    } catch (error) {
      response.notFound({ message: 'Not found' })
    }
  }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
