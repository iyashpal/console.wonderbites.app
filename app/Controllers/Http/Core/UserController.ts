import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UserController {
  public async handle({ auth, response }: HttpContextContract) {
    response.status(200).json(auth.use('api').user)
  }
}
