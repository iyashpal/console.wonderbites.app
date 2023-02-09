import {Ingredient} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

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

  public async show ({response, params}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.query().where('id', params.id).firstOrFail()

      response.json(ingredient)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({params, response}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.findByOrFail('id', params.id)

      await ingredient.delete()

      response.ok({success: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
