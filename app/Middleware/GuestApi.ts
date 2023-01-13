import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class GuestApi {
  public async handle({auth, response}: HttpContextContract, next: () => Promise<void>) {
    console.log(auth.use('api').isGuest, auth.use('api').isLoggedIn)
    if (auth.use('api').isGuest) {
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
