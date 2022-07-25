import PasswordReset from 'App/Models/PasswordReset'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NewPasswordController {
  /**
     * Display the password reset form.
     * 
     * @param param0 HttpContextContract
     * @returns ViewRendererContract
     */
  public async create ({ inertia, params }: HttpContextContract) {
    const token = await PasswordReset.findBy('token', params.token)

    return inertia.render('Auth/ResetPassword', { email: token?.email, token: token?.token })
  }

  public async store ({ request, response }: HttpContextContract) {
    const args = await this.validateRequest(request)

    console.log(args)

    response.redirect().back()
  }

  protected validateRequest (request) {
    return request.validate({
      schema: {
        token: schema.string({ trim: true }, [
          rules.exists({ table: 'password_resets', column: 'token' }),
        ]),

        email: schema.string({ trim: true }, [
          rules.email(),
          rules.exists({ table: 'users', column: 'email' }),
        ]),

        password: schema.string({ trim: true }, [
          rules.confirmed(),
        ]),
      },

      // messages: {},
    })
  }
}
