import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import PasswordResetLink from 'App/Helpers/Auth/PasswordResetLink'

export default class PasswordResetLinksController extends PasswordResetLink {
  /**
   * Display the password reset link request view.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ inertia }: HttpContextContract) {
    return inertia.render('Auth/ForgotPassword')
  }
}
