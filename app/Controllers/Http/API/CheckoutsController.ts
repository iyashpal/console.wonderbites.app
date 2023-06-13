import { Cart, Order } from 'App/Models'
import {OrderBuilder} from 'App/Helpers/Database'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/API/Checkouts/ProcessValidator'

export default class CheckoutsController {
  public async process ({ auth, response, request }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const attrs = await request.validate(ProcessValidator)

      // Load and validate cart by the requested cart id
      const cart = await Cart.query()
        .where('id', attrs.cart)
        .match([user, query => query.where('user_id', user.id)])
        .preload('ingredients').preload('products').firstOrFail()

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
        options: JSON.stringify(attrs.options),
      })

      await order.related('products').attach(this.cartProducts(cart.products))

      await order.related('ingredients').attach(this.cartIngredients(cart.ingredients))

      if (order.id) {
        // Delete the cart if the order created.
        await Cart.query().where('id', attrs.cart).delete()
      }

      const data = await (new OrderBuilder(request)).resolve('checkout')
        .query().where('id', order.id).firstOrFail()

      // Send order in response with all associated data.
      response.ok(data)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public cartProducts (items: any[]) {
    const products = {}

    items.forEach(product => (products[product.id] = { qty: product.$extras.pivot_qty, price: product.price }))

    return products
  }

  public cartIngredients (items: any[]) {
    const ingredients = {}

    items.map((ingredient) => (ingredients[ingredient.id] = {
      price: ingredient.price,
      qty: ingredient.$extras.pivot_qty,
      product_id: ingredient.$extras.pivot_product_id,
    }))

    return ingredients
  }
}
