import Category from 'App/Models/Category'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { CategoryBuilder } from 'App/Helpers/Database'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   *
   * @param param0 HttpContextContract
   */
  public async index ({ auth, response, request }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      CategoryBuilder.make(request, 'category')
      const category = await (new CategoryBuilder(request, 'category')).auth(user).run()

      response.status(200).json(category)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ auth, response, params: { id }, request }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const category = await (new CategoryBuilder(request))
        .asUser(user).query().where('status', 'public').where('id', id).firstOrFail()

      response.status(200).json(category)
    } catch (error) {
      response.notFound({ message: 'Category Not Found' })
    }
  }
}
