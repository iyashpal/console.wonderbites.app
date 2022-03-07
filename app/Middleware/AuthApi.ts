import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AuthApi {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.use('api').authenticate()

      await next()
    } catch (error) {
      response.unauthorized({ message: 'Unauthenticated' })
    }
  }
}
