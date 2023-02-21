import { Product } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Core/Products/CreateValidator'
import UpdateValidator from 'App/Validators/Core/Products/UpdateValidator'

export default class ProductsController {
  public async index ({ response, request }: HttpContextContract) {
    const { page = 1, limit = 10 } = <{ page: number, limit: number }>request.all()

    const products = await Product.query().whereNull('deleted_at')
      .orderBy('id', 'desc').paginate(page, limit)

    response.status(200).json(products)
  }

  public async store ({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.use('api').user?.id

      const { name, price, description, sku, publishedAt } = await request.validate(CreateValidator)

      const product = await Product.create({ userId, name, price, sku, description, publishedAt })

      response.json(product.toObject())
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ params, response }: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      response.ok(product.toObject())
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({ response, request, params }: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      const { name, price, sku, description, publishedAt } = await request.validate(UpdateValidator)

      await product.merge({ name, price, sku, description, publishedAt }).save()

      response.ok(product.toObject())
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      await product.delete()

      response.ok({success: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
