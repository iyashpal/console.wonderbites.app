import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {Category} from 'App/Models'

export default class CategoriesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page, limit} = <{page: number, limit: number}>request.all()
      const categories = await Category.query()
        .paginate(page ?? 1, limit ?? 10)

      response.json(categories)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async store ({request, response}: HttpContextContract) {
    //
  }

  public async show ({request, response}: HttpContextContract) {
    //
  }

  public async update ({request, response}: HttpContextContract) {
    //
  }

  public async destroy ({request, response}: HttpContextContract) {
    //
  }
}
