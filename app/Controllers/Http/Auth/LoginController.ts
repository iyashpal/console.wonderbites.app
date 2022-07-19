import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  /**
   * Display the login form.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ inertia }: HttpContextContract) {
    return await inertia.render('Auth/Login')
  }

  public async login ({ auth, request, response, session }: HttpContextContract) {
    const { email, password } = await this.validateRequest(request)

    try {
      await auth.use('web').attempt(email, password)

      response.redirect('/')
    } catch (error) {
      // Check if the error is Invalid auth password.
      if (error.message.includes('E_INVALID_AUTH_PASSWORD')) {
        session.flash({ errors: { password: ['Password do not match.'] } })
      }

      // redirect back to previous page
      response.redirect().back()
    }
  }

  public async logout ({ auth, response }: HttpContextContract) {
    await auth.logout()

    response.redirect('/')
  }

  /**
   * Validate the login request.
   * 
   * @param request 
   * @returns 
   */
  protected validateRequest (request) {
    return request.validate({
      schema: schema.create({
        email: schema.string({ trim: true }, [
          rules.email(),
          rules.exists({ table: 'users', column: 'email' }),
        ]),
        password: schema.string({ trim: true }),
      }),

      messages: {
        'email.required': 'Email address is required to login.',
        'email.email': 'Enter a valid email address.',
        'email.exists': 'Email does not exists.',
        'password.required': 'Enter password to login.',
      },
    })
  }
}
