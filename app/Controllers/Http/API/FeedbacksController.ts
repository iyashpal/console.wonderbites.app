import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/API/Feedback/CreateValidator'

export default class FeedbacksController {
  public async store ({ auth, request, response }: HttpContextContract) {
    const user = auth.use('api').user!

    try {
      const args = await request.validate(CreateValidator)

      const feedback = await user.related('feedbacks').create(args)

      response.json(feedback)
    } catch (error) {
      throw error
    }
  }
}
