import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  public async handle({response, auth}: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      response.status(200).json({revoked: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
