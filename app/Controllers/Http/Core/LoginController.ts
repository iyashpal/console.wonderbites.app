import {User} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import LoginValidator from 'App/Validators/Core/Auth/LoginValidator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async handle ({request, response, auth}: HttpContextContract) {
    try {
      const {email, password} = await request.validate(LoginValidator)

      const user = await User.query().where('email', email).firstOrFail()

      if (user?.isRoleAssigned()) {
        const token = await auth.use('api').attempt(email, password, {
          name: 'Core team login.',
          ip_address: request.ip(),
        })

        response.status(200).json(token)
      } else {
        response.unauthorized({
          name: 'AuthorizationException',
          code: 'E_UNAUTHORIZED_ACCESS',
          message: 'Unauthorized access',
        })
      }
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
