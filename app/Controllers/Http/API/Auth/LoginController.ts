import ErrorJSON from 'App/Helpers/ErrorJSON'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/API/Auth/LoginValidator'

export default class LoginController {
  /**
   * Authenticate users.
   *
   * @param param0 {HttpContextContract} Request Data
   * @returns {JSON}
   */
  public async handle ({auth, request, response}: HttpContextContract) {
    try {
      const { email, mobile = '', password } = await request.validate(LoginValidator)

      const token = await auth.use('api').attempt(email ?? mobile, password)

      response.ok(token)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
