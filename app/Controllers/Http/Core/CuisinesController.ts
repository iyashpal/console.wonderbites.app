import {Cuisine} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CuisinesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{page: number, limit: number}>request.all()

      const cuisines = await Cuisine.query().whereNull('deleted_at').paginate(page, limit)

      response.json(cuisines)
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
  }

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
