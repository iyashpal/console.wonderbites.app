import User from 'App/Models/User'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UserCreateValidator from 'App/Validators/User/CreateValidator'

export default class RegisterController {
  /**
   * Register users.
   * 
   * @param param0 {HttpContextContract} 
   * @param {JSON}
   */
  public async register ({ request, response }: HttpContextContract) {
    const data = await request.validate(UserCreateValidator)
    try {
      const user = await User.create({
        ...data,
        avatar: data.avatar ? Attachment.fromFile(request.file('avatar')!) : null,
      })

      response.status(200).json(user)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
