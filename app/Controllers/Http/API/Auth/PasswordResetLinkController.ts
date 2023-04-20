import {User} from 'App/Models'
import {rules, schema} from '@ioc:Adonis/Core/Validator'
import SendPasswordResetLink from 'App/Mailers/SendPasswordResetLink'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'

export default class PasswordResetLinkController {
  /**
   * Display the password reset link request view.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async handle ({request, response}: HttpContextContract) {
    const {email} = await this.validateRequest(request)

    const user = <User>await User.findBy('email', email)

    try {
      await (new SendPasswordResetLink(user)).send()

      response.json({ success: true})
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
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

        email: schema.string({trim: true}, [
          rules.email(),
          rules.exists({table: 'users', column: 'email'}),
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
