import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/API/Auth/LoginValidator'

export default class LoginController {
  /**
   * Authenticate users.
   *
   * @param param0 {HttpContextContract} Request Data
   * @returns {JSON}
   */
  public async handle ({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginValidator)

      const token = await auth.use('api').attempt(email, password)

      response.status(200).json(token)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
