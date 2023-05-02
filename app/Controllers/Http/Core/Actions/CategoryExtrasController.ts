import { Category } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoryExtrasController {
  public async handle ({ request, response, params }: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).firstOrFail()
      await category.merge({ options: JSON.stringify({ extras: request.input('extras') }) }).save()

      response.ok({category})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
