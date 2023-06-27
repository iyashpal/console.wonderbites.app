import { Category } from 'App/Models'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryExtrasController {
  public async handle ({ request, response, params }: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).firstOrFail()
      await category.merge({ options: { extras: request.input('extras') } }).save()

      response.ok({category})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
