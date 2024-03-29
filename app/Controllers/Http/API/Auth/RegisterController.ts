import {User} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/API/Auth/RegisterValidator'

export default class RegisterController {
  /**
   * Register users.
   *
   * @param param0 {HttpContextContract}
   */
  public async handle ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterValidator)

      const avatar = payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null

      const user = await User.create({ ...payload, avatar })

      response.status(200).json(user)
    } catch (error) {
      throw error
    }
  }
}
