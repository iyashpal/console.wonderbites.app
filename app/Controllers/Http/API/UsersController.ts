import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AvatarValidator from 'App/Validators/API/User/AvatarValidator'
import UpdateValidator from 'App/Validators/API/User/UpdateValidator'

export default class UsersController {
  public async index ({ }: HttpContextContract) {
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

    try {
      const payload = await request.validate(UpdateValidator)

      if (payload.imagePath) {
        await payload.imagePath?.moveToDisk('avatars')
      }

      await user.merge({ ...payload, imagePath: payload.imagePath ? payload.imagePath.fileName : user.imagePath })
        .save().then(user => response.ok(user))
    } catch (error) {
      response.unprocessableEntity(error)
    }
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

    try {
      await user.load('addresses')

      response.status(200).json(user)
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Update or remove the user avatar.
   * 
   * @param param0 HttpContextContract
   */
  public async avatar ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const payload = await request.validate(AvatarValidator)

      if (payload.avatar) {
        await payload.avatar?.moveToDisk('avatars')

        await user.merge({ imagePath: payload.avatar.fileName })
          .save().then(user => response.json(user))
      } else {
        await user.merge({ imagePath: null }).save().then(user => response.json(user))
      }
    } catch (error) {
      response.unprocessableEntity(error)
    }
  }
}
