import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

/**
 * Auth middleware is meant to restrict un-authenticated access to a given route
 * or a group of routes.
 *
 * You must register this middleware inside `start/kernel.ts` file under the list
 * of named middleware.
 */
export default class AuthMiddleware {
  public async handle ({auth, response}: HttpContextContract, next: () => Promise<void>) {
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
