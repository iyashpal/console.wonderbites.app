import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Order, Product } from 'App/Models'
import ErrorJSON from 'App/Helpers/ErrorJSON'

export default class OrdersController {
  public async index ({ request, response }: HttpContextContract) {
    try {
      const { page = 1, limit = 10 } = request.all() as { page: number, limit: number }
      const orders = await Order.query().preload('user').paginate(page, limit)

      response.ok(orders)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ params, response }: HttpContextContract) {
    try {
      const order = await Order.query().where('id', params.id).preload('user').firstOrFail()

      response.ok({
        ...order.toJSON(),
        products: await Product.query().whereIn('id', order.ProductIDs()),
      })
    } catch (e) {
      response.status(e.status).json(new ErrorJSON(e))
    }
  }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
