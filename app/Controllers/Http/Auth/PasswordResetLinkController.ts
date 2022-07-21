import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import SendPasswordResetLink from 'App/Mailers/SendPasswordResetLink'
import { User } from 'App/Models'
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

  public async store ({ request }: HttpContextContract) {
    const { email } = await this.validateRequest(request)

    const user = <User>await User.findBy('email', email)

    await (new SendPasswordResetLink(user)).send()
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

        'email.required': 'Email address is required to login.',
        'email.email': 'Enter a valid email address.',
        'email.exists': 'Email does not exists.',

      },
    })
  }

  public testing () {

  }
}
