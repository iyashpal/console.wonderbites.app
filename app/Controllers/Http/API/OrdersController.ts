import {builder} from 'App/Helpers/Database'
import {OrderStatus} from 'App/Models/Enums/Order'
import ErrorJSON from 'App/Helpers/ErrorJSON'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import { Category, Ingredient, Order, Product, Variant} from 'App/Models'

export default class OrdersController {
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
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  public async show ({auth, params, bouncer, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user

      const order = await builder('Order', request, 'order')
        .query().where('id', params.id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('view', order)

      response.status(200).json(await this.data(request, order))
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
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
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
