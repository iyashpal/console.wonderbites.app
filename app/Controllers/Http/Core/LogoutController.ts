import ErrorJSON from 'App/Helpers/ErrorJSON'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  public async handle ({response, auth}: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      response.status(200).json({revoked: true})
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
