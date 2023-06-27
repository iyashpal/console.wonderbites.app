import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {Order} from 'App/Models'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'

export default class OrdersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as {page: number, limit: number}
      const orders = await Order.query().preload('user').paginate(page, limit)

      response.ok(orders)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
