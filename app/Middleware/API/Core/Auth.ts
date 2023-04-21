import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class AuthMiddleware {
  public async handle ({response, auth}: HttpContextContract, next: () => Promise<void>) {
    const guard = auth.use('api')

    if (guard.isLoggedIn && guard.user?.isRoleAssigned()) {
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
