import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index ({ }: HttpContextContract) {
  }

  public async store ({ }: HttpContextContract) {
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ }: HttpContextContract) {
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
      firstName: request.input('firstName') ? request.input('first_name') : user.firstName,
      lastName: request.input('lastName') ? request.input('last_name') : user.lastName,
      imagePath: image ? image!.fileName : user.imagePath,
    }).save().then((user) => response.status(200).json(user))
  }

  public async destroy ({ }: HttpContextContract) {
  }

  /**
   * Display the authenticated user's data.
   *
   * @param param0 HttpContextContract
   */
  public async auth ({ auth, response }: HttpContextContract) {
    const user = auth.use('api').user!

    await user.load('addresses')

    response.status(200).json(user)
  }
}
