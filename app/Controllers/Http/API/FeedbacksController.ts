import CreateValidator from 'App/Validators/Feedback/CreateValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FeedbacksController {
  public async index ({ }: HttpContextContract) { }

  public async store ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const args = await request.validate(CreateValidator)

      const feedback = await user.related('feedbacks').create(args)

      response.json(feedback)
    } catch (error) {
      response.unprocessableEntity(error)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
