import {Cart, Order} from 'App/Models'
import {uniqueHash} from 'App/Helpers/Core'
import ErrorJSON from 'App/Helpers/ErrorJSON'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/API/Checkouts/ProcessValidator'

export default class CheckoutsController {
  protected checkoutHeaders (request: RequestContract) {
    return {
      id: request.header('X-Cart-ID', 0) as number,
      token: request.header('X-Cart-Token', uniqueHash()),
    }
  }

  public async process ({auth, response, request}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {id, token} = this.checkoutHeaders(request)

      const attrs = await request.validate(ProcessValidator)

      const cart = await Cart.query().where('status', 1)
        .match([user?.id, query => query.where('user_id', user.id)])
        .match([id !== 0, query => query.where('id', id).where('token', token)])
        .firstOrFail()

      // Create order from cart details.
      let order = await Order.create({
        note: attrs.note,
        firstName: attrs.firstName,
        lastName: attrs.lastName,
        token: cart.token,
        email: attrs.email,
        phone: attrs.phone,
        street: attrs.street,
        city: attrs.city,
        data: cart.data,
        reservedSeats: attrs.reservedSeats,
        eatOrPickupTime: attrs.eatOrPickupTime,
        couponId: cart.couponId,
        userId: user?.id ?? null,
        location: attrs.location,
        orderType: attrs.orderType,
        paymentMode: attrs.paymentMode,
        options: attrs.options,
      })

      if (order?.id) {
        // Delete the cart if the order created.
        await Cart.query().where('id', id).delete()
      }

      // Send order in response with all associated data.
      response.ok(order)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
