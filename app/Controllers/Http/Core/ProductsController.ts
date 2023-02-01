import { Product } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Core/Products/CreateValidator'

export default class ProductsController {
  public async index({ response, request }: HttpContextContract) {
    const { page, limit } = <{ page: number, limit: number }>request.all()

    const products = await Product.query().whereNull('deleted_at').orderBy('id', 'desc').paginate(page ?? 1, limit ?? 10)

    response.status(200).json(products)
  }

  public async store({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.use('api').user?.id
      
      const { name, price, description, sku, publishedAt } = await request.validate(CreateValidator)

      const product = await Product.create({ userId, name, price, sku, description, publishedAt })

      response.json(product.toObject())
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show({ }: HttpContextContract) {
  }

  public async update({ }: HttpContextContract) {
  }

  public async destroy({ }: HttpContextContract) {
  }
}
