import User from 'App/Models/User'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import CreateValidator from 'App/Validators/User/CreateValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RegistersController {
  /**
   * Display user registration form.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view }: HttpContextContract) {
    return await view.render('auth/register')
  }

  public async register ({ request, auth, response }: HttpContextContract) {
    const payload = await request.validate(CreateValidator)

    const user = await User.create({
      // Request Validator Payload
      ...payload,

      // Conditional update of user avatar
      avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null,
    })

    await auth.login(user)

    return response.redirect('/')
  }
}
