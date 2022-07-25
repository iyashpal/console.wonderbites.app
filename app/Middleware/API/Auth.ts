import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Auth {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.use('api').isLoggedIn) {
      await next()

      return
    }

    response.unauthorized({ message: 'Unauthenticated' })
  }
}
