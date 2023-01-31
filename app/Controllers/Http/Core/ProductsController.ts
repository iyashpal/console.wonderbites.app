import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { Product } from 'App/Models'
import CreateValidator from 'App/Validators/Core/Products/CreateValidator'

export default class ProductsController {
  public async index({ response, request }: HttpContextContract) {
    const { page, limit } = <{ page: number, limit: number }>request.all()

    const products = await Product.query().whereNull('deleted_at').paginate(page ?? 1, limit ?? 10)

    response.json(products)
  }

  public async store({ request, response }: HttpContextContract) {
    try {
      const { name, categoryId, price, description, sku } = await request.validate(CreateValidator)

      // console.log({ name, categoryId, price, description, sku })

      response.json({ name, categoryId, price, description, sku })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show({ }: HttpContextContract) {
  }

  public async edit({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
