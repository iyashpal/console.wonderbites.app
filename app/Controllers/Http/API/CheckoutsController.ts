import { Cart, Order } from 'App/Models'
import OrderQuery from 'App/Helpers/Database/OrderQuery'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/Checkouts/ProcessValidator'

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
        userId: user?.id ?? null,
        deliverTo: attrs.address,
        couponId: cart.couponId,
        ipAddress: cart.ipAddress,
        options: attrs.options,
      })

      await order.related('products').attach(this.cartProducts(cart.products))

      await order.related('ingredients').attach(this.cartIngredients(cart.ingredients))

      if (order.id) {
        // Delete the cart if the order created.
        await Cart.query().where('id', attrs.cart).delete()
      }

      const data = await (new OrderQuery(request)).resolveQueryWithPrefix('checkout')
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
