import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import {Ingredient} from 'App/Models'

export default class IngredientsController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const ingredients = await Ingredient.query()
        .whereNull('deleted_at')
        .paginate(request.input('page', 1), request.input('limit', 10))

      response.status(200).json(ingredients)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
