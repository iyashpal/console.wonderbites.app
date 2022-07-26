import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Guest {
  public async handle ({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    if (auth.use('api').isGuest) {
      await next()

      return
    }

    response.unauthorized({ message: 'unauthorized access' })
  }
}