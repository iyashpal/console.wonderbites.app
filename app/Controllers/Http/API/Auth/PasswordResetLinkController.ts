import {User} from 'App/Models'
import SendPasswordResetLink from 'App/Mailers/SendPasswordResetLink'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import PasswordResetLinkValidator from 'App/Validators/API/Auth/PasswordResetLinkValidator'

export default class PasswordResetLinkController {
  /**
   * Display the password reset link request view.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async handle ({ request, response }: HttpContextContract) {
    try {
      const {email} = await request.validate(PasswordResetLinkValidator)
      const user = <User>await User.findBy('email', email)
      await (new SendPasswordResetLink(user)).send()

      response.json({ success: true})
    } catch (error) {
      throw error
    }
  }
}
