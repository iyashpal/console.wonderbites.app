import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class GuestApi {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      await auth.use('api').authenticate()

      response.unauthorized({ message: 'Only guest users are allowed.' })
    } catch (error) {
      await next()
    }
  }
}
