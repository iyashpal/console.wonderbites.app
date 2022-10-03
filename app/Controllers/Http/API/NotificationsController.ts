import { DateTime } from 'luxon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/API/Notification/UpdateValidator'

export default class NotificationsController {
  public async index ({ auth, response, request }: HttpContextContract) {
    const user = auth.use('api').user!
    try {
      const notifications = await user.related('notifications').query()
        .paginate(request.input('page', 1), request.input('limit', 10))

      response.json(notifications)
    } catch (error) {
      response.badRequest(error)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async update ({ auth, request, params, response }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const payload = await request.validate(UpdateValidator)
      const notification = await user.related('notifications').query().where('id', params.id).firstOrFail()

      await notification.merge({ readAt: payload.action === 'read' ? DateTime.now() : null })
        .save().then(notification => response.json(notification))
    } catch (error) {
      response.status(error.status).json(error)
    }
  }

  public async destroy ({ }: HttpContextContract) { }
}
