import {uniqueHash} from 'App/Helpers/Core'
import {OrderStatus} from 'App/Models/Enums/Order'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {builder, OrderBuilder} from 'App/Helpers/Database'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ProcessValidator from 'App/Validators/API/Checkouts/ProcessValidator'
import {Cart, Category, Ingredient, Order, Product, Variant} from 'App/Models'

export default class OrdersController {
  protected checkoutHeaders (request: RequestContract) {
    return {
      id: request.header('X-Cart-ID', 0) as number,
      token: request.header('X-Cart-Token', uniqueHash()),
    }
  }

  protected async data (request: RequestContract, order: Order) {
    const products = async () => {
      if (request.input('with', []).includes('products')) {
        return Product.query().whereIn('id', order.ProductIDs())
      }

      return []
    }

    const variants = () => {
      if (request.input('with', []).includes('variants')) {
        return Variant.query().whereIn('id', order.VariantIDs())
      }
      return []
    }

    const ingredients = () => {
      if (request.input('with', []).includes('ingredients')) {
        return Ingredient.query().whereIn('id', order.IngredientIDs())
      }

      return []
    }

    const categories = () => {
      if (request.input('with', []).includes('categories')) {
        return Category.query().whereIn('id', order.CategoryIDs())
      }

      return []
    }

    return {
      ...order.toJSON(),
      products: await products(),
      ingredients: await ingredients(),
      variants: await variants(),
      categories: await categories(),
    }
  }

  public async index ({bouncer, auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      await bouncer.forUser(user).with('OrderPolicy').authorize('viewList')

      const orders = await builder('Order', request, 'orders').query()

        .where('user_id', user.id)
        .orderBy(request.input('orderBy', 'created_at'), request.input('order', 'desc'))
        .paginate(request.input('page', 1), request.input('limit', 50))

      response.status(200).json(orders)
    } catch (error) {
      console.log(error)
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async store ({auth, response, request}: HttpContextContract) {
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

      const data = await Order.query().where('id', order.id).firstOrFail()

      // Send order in response with all associated data.
      response.ok(data)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async show ({auth, params, bouncer, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user

      const order = await (new OrderBuilder(request, 'order'))
        .query().where('id', params.id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)

      response.status(200).json(await this.data(request, order))
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  /**
   * Cancel user orders.
   *
   * @param param0 {HttpContextContract}
   */
  public async cancel ({auth, bouncer, params: {id}, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const order = await Order.query().where('id', id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('update', order)

      const canceledOrder = await order.merge({status: OrderStatus.CANCELED}).save()

      response.ok(canceledOrder)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
