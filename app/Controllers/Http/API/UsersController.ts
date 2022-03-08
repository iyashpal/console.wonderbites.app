//import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   */
  public async show ({ auth, response }: HttpContextContract) {
    const user = auth.use('api').user!

    await user.load('addresses')

    response.status(200).json(user)
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    const image = request.file('image_path')

    if (image) {
      await image.moveToDisk('./')
    }

    await user.merge({
      first_name: request.input('first_name')? request.input('first_name') : user.first_name ,
      last_name: request.input('last_name')? request.input('last_name') : user.last_name ,
      image_path: image ? image!.fileName : user.image_path,
    }).save().then((user) => response.status(200).json(user))
  }

  public async destroy ({ }: HttpContextContract) { }
}
