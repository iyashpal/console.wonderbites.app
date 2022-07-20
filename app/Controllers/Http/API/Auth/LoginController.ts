import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class LoginController {
  /**
   * Authenticate users.
   * 
   * @param param0 {HttpContextContract} Request Data
   * @returns {JSON}
   */
  public async login ({ auth, request, response }: HttpContextContract) {
    const { email, password } = await this.validateRequest(request)

    try {
      const token = await auth.use('api').attempt(email, password)

      return response.status(200).json(token)
    } catch {
      return response.badRequest({
        errors: [
          {
            rule: 'incorrect',
            field: 'password',
            message: 'Password do not match.',
          },
        ],
      })
    }
  }

  /**
   * Revoke API token of logged in user.
   * 
   * @param param0 HttpContextContract
   * 
   * @return {JSON}
   */
  public async logout ({ auth, response }: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      response.status(200).json({ revoked: true })
    } catch (error) {
      response.badRequest(error.messages)
    }
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
