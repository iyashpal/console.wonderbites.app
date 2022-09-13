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

  public async show ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
