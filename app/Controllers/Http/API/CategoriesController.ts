import {builder} from 'App/Helpers/Database'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   *
   * @param param0 HttpContextContract
   */
  public async index ({auth, response, request}: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const category = await builder('Category', request, 'category').auth(user).run().where('status', 'public')
      response.status(200).json(category)
    } catch (error) {
      throw error
    }
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({auth, response, params: {id}, request}: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const category = await builder('Category', request)
        .auth(user).query().where('status', 'public').where('id', id).firstOrFail()

      response.status(200).json(category)
    } catch (error) {
      throw error
    }
  }
}
