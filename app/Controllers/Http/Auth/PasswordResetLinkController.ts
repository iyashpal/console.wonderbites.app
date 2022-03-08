import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class PasswordResetLinksController {
  /**
   * Display the password reset link request view.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('auth/forgot-password')
  }
}
