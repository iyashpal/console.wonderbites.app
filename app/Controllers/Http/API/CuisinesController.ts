import Cuisine from 'App/Models/Cuisine'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CuisinesController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract 
   */
  public async index ({ request, response }: HttpContextContract) {
    try {
      const cuisines = await Cuisine.query()
        .match([
          request.input('with', []).includes('cuisines.categories'),
          query => query.preload('categories'),
        ])
        .match([
          request.input('limit'),
          async (query) => await query.paginate(
            request.input('page', 1),
            request.input('limit', 10)
          ),
        ])

      response.status(200).json(cuisines)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show ({ request, response, params: { id } }: HttpContextContract) {
    try {
      const cuisine = await Cuisine.query()
        .match([
          request.input('with', []).includes('cuisine.categories'),
          query => query.preload('categories'),
        ])
        .where('id', id).firstOrFail()

      response.status(200).json(cuisine)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
