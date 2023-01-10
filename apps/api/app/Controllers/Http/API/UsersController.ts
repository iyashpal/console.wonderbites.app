import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
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
  public async show ({auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      if (request.input('with', []).includes('user.addresses')) {
        await user.load('addresses')
      }

      response.status(200).json(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  /**
   * Update the specified resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async update ({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const payload = await request.validate(UpdateValidator)

      await user.merge({
        // Request Validator Payload
        ...payload,

        // Conditional update of user avatar
        avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : user.avatar,
      }).save()

      response.status(200).ok(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({ }: HttpContextContract) {
  }

  /**
   * Display the authenticated user's data.
   *
   * @param param0 HttpContextContract
   */
  public async auth ({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      if (request.input('with', []).includes('user.addresses')) {
        await user.load('addresses')
      }

      response.status(200).json(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  /**
   * Update or remove the user avatar.
   * 
   * @param param0 HttpContextContract
   */
  public async avatar ({ auth, request, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const payload = await request.validate(AvatarValidator)

      await user.merge({
        avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null,
      }).save()

      response.status(200).json(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
