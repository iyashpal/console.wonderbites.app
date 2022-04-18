import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthApi {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    await auth.use('api').check()

    if (auth.use('api').isLoggedIn) {
      await next()

      return
    }

    response.unauthorized({ message: 'Unauthenticated' })
  }
}
