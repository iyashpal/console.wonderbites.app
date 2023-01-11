import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/API/Auth/LoginValidator'

export default class LoginController {
  /**
   * Authenticate users.
   * 
   * @param param0 {HttpContextContract} Request Data
   * @returns {JSON}
   */
  public async login ({ auth, request, response }: HttpContextContract) {
    try {
      const { email, password } = await request.validate(LoginValidator)

      const token = await auth.use('api').attempt(email, password)

      response.status(200).json(token)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
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
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
