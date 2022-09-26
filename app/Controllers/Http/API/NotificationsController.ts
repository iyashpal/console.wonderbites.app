import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class NotificationsController {
  public async index ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!
    try {
      const notifications = user.related('notifications').query()
        .paginate(
          request.input('page', 1),
          request.input('limit', 10)
        )

      response.json(notifications)
    } catch (error) {
      response.badRequest(error)
    }
  }

  public async store ({ }: HttpContextContract) { }

  public async show ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
