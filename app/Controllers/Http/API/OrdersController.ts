import {builder} from 'App/Helpers/Database'
import {OrderStatus} from 'App/Models/Enums/Order'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/API/Orders/UpdateValidator'
import {Category, Ingredient, Order, Product, Variant} from 'App/Models'

export default class OrdersController {
  private async data (request: RequestContract, order: Order) {
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

      const {
        page = 1, limit = 10, order = 'desc', orderBy = 'created_at',
      } = request.all() as { page: number, limit: number, order: 'asc' | 'desc', orderBy: string }

      await bouncer.forUser(user).with('OrderPolicy').authorize('viewList')

      const orders = await builder('Order', request, 'orders')
        .query().where('user_id', user.id).orderBy(orderBy, order).paginate(page, limit)

      response.status(200).json(orders)
    } catch (error) {
      throw error
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
      throw error
    }
  }

  /**
   * Cancel user orders.
   *
   * @param param0 {HttpContextContract}
   */
  public async update ({auth, bouncer, params: {id}, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {action} = await request.validate(UpdateValidator)

      const order = await Order.query().where('id', id).firstOrFail()

      await bouncer.forUser(user).with('OrderPolicy').authorize('update', order)

      const canceledOrder = await order.merge({
        ...(action === 'cancel' ? {status: OrderStatus.CANCELLED} : {}),
      }).save()

      response.ok(canceledOrder)
    } catch (error) {
      throw error
    }
  }
}
