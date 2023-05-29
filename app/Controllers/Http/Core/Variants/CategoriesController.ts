import { Category } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Variants/Categories/StoreValidator'

export default class CategoriesController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) { }

  public async store ({ request, response, params }: HttpContextContract) {
    try {
      const { name, description, order, status } = await request.validate(StoreValidator)
      const category = await Category.create({
        name, description, status, type: 'Variant',
      })

      await category.related('variants').attach({ [params.variant_id]: { order } })

      response.ok(category)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
