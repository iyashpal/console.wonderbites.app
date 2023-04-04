import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import {Order} from 'App/Models'

export default class OrdersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as {page: number, limit: number}
      const orders = await Order.query().preload('user').paginate(page, limit)

      response.ok(orders)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
