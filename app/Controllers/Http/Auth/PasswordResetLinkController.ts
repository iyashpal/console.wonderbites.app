import { User } from 'App/Models'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SendPasswordResetLink from 'App/Mailers/SendPasswordResetLink'

export default class PasswordResetLinksController {
  /**
   * Display the password reset link request view.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ inertia }: HttpContextContract) {
    return inertia.render('Auth/ForgotPassword')
  }

  /**
   * Display the password reset link request view.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async store ({ request, response }: HttpContextContract) {
    const { email } = await this.validateRequest(request)

    const user = <User>await User.findBy('email', email)

    let success = false

    try {
      await (new SendPasswordResetLink(user)).send()

      success = true
    } catch (error) {
      success = false
    }

    if (request.accepts(['json'])) {
      return response.json({ success })
    }

    response.redirect().toRoute('password.request', {}, { qs: { success } })
  }

  /**
   * Validate the reset password request.
   * 
   * @param request Incoming request.`
   * @returns 
   */
  protected validateRequest (request) {
    return request.validate({

      schema: schema.create({

        email: schema.string({ trim: true }, [
          rules.email(),
          rules.exists({ table: 'users', column: 'email' }),
        ]),

      }),

      messages: {

        'email.required': 'Email address is required.',
        'email.email': 'Enter a valid email address.',
        'email.exists': 'Email does not exists.',

      },
    })
  }
}
