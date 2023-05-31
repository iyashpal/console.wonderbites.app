import { Order } from 'App/Models'
import { OrderStatus } from 'App/Models/Enums/Order'
import OrderQuery from 'App/Helpers/Database/OrderQuery'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class OrdersController {
  public async index ({ bouncer, auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      await bouncer.forUser(user).with('OrderPolicy').authorize('viewList')

      const orders = await (new OrderQuery(request))
        .resolveQueryWithPrefix('orders')
        .query()

        .where('user_id', user.id)
        .orderBy(request.input('orderBy', 'created_at'), request.input('order', 'desc'))
        .paginate(request.input('page', 1), request.input('limit', 50))

      response.status(200).json(orders)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ auth, params, bouncer, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user

      const order = await (new OrderQuery(request))

        .resolveQueryWithPrefix('order')

        .query().where('id', params.id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)

      response.status(200).json(order)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  /**
   * Cancel user orders.
   *
   * @param param0 {HttpContextContract}
   */
  public async cancel ({ auth, bouncer, params: { id }, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const order = await Order.query().where('id', id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('update', order)

      const canceledOrder = await order.merge({ status: OrderStatus.CANCELED }).save()

      response.ok(canceledOrder)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
