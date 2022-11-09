import { Address, Cart, Order, User } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/Checkouts/ProcessValidator'

export default class CheckoutsController {
  protected user: User

  protected response: object = {}

  public async process ({ auth, response, request }: HttpContextContract) {
    this.user = auth.use('api').user!

    try {
      const attrs = await request.validate(ProcessValidator)

      // Load and validate cart by the requested cart id
      const cart = await Cart.query()
        .where('id', attrs.cart).where('user_id', this.user.id)
        .preload('ingredients').preload('products').firstOrFail()

      // Load and validate the order address by request requested address id
      const address = await Address.query()
        .where('id', attrs.address).where('user_id', this.user.id).firstOrFail()

      try {
        // Create order from cart details.
        let order = await Order.create({
          note: attrs.note,
          userId: this.user.id,
          addressId: address.id,
          couponId: cart.couponId,
          ipAddress: cart.ipAddress,
          paymentMethod: attrs.payment_method,
        })

        if (order.id) {
          // Delete the cart if the order created.
          await Cart.query().where('id', attrs.cart).delete()
        }

        await order.related('products').attach(this.cartProducts(cart.products))

        await order.related('ingredients').attach(this.cartIngredients(cart.ingredients))

        // Send order in response with all associated data.
        response.json(
          await Order.query()
            .preload('user')
            .preload('address')
            .preload('products')
            .preload('ingredients')
            .where('id', order.id)
            .first()
        )
      } catch (error) {
        response.badRequest({ message: 'Something went wrong' })
      }
    } catch (error) {
      response.unprocessableEntity(error)
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
