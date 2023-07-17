import { Cart, Order } from 'App/Models'
import Event from '@ioc:Adonis/Core/Event'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/API/Checkouts/ProcessValidator'

export default class CheckoutController {
  public async handle ({auth, response, params, request}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const { id, token } = params as {id: number, token: string}

      const attrs = await request.validate(ProcessValidator)

      const cart = await Cart.query().where('status', 1)
        .match([user?.id, query => query.where('user_id', user.id)])
        .match([id && token, query => query.where('id', id).where('token', token)]).firstOrFail()

      // Create order from cart details.
      let order = await Order.create({ ...attrs, data: cart.data ?? [], userId: user?.id, couponId: cart.couponId })

      if (order?.id) {
        // Delete the cart if the order created.
        await Cart.query().where('id', id).delete()
      }

      await Event.emit('Checkout:OrderCreated', order)

      // Send order in response with all associated data.
      response.ok(order)
    } catch (error) {
      throw error
    }
  }
}
