import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

/**
 * Silent auth middleware can be used as a global middleware to silent check
 * if the user is logged-in or not.
 *
 * The request continues as usual, even when the user is not logged-in.
 */
export default class SilentAuthMiddleware {
  /**
   * Handle request
   */
  public async handle ({auth, request}: HttpContextContract, next: () => Promise<void>) {
    /**
     * Define the path segments which applies the api guard.
     */
    const segments = ['/core', '/api']

    /**
     * Check if user is logged-in or not. If yes, then `ctx.auth.user` will be
     * set to the instance of the currently logged-in user.
     */
    if (segments.some(segment => request.url().includes(segment))) {
      await auth.use('api').check()
    } else {
      await auth.check()
    }
    await next()
  }
}
