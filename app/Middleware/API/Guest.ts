import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class GuestMiddleware {
  public async handle ({ auth, response, request }: HttpContextContract, next: () => Promise<void>) {
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
