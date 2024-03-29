import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class LogoutController {
  /**
   * Revoke API token of logged-in user.
   *
   * @param param0 HttpContextContract
   *
   * @return {JSON}
   */
  public async handle ({auth, response}: HttpContextContract) {
    try {
      await auth.use('api').revoke()

      response.status(200).json({revoked: true})
    } catch (error) {
      throw error
    }
  }
}
