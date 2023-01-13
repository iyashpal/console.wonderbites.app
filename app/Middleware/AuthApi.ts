import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class AuthApi {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    if (auth.use('api').isLoggedIn) {
      await next()

      return
    }

    response.unauthorized({
      name: 'AuthorizationException',
      code: 'E_UNAUTHORIZED_ACCESS',
      message: 'Unauthorized access',
    })
  }

}
