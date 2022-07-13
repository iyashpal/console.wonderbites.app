import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthApi {
  public async handle ({ auth, response, request }: HttpContextContract, next: () => Promise<void>, guards?: string[]) {
    if (auth.use('api').isLoggedIn) {
      await next()

      return
    }

    response.unauthorized({ message: 'Unauthenticated' })
  }
}
