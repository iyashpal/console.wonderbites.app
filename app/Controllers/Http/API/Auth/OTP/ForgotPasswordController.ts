import {DateTime} from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import {string} from '@ioc:Adonis/Core/Helpers'
import {User, VerificationCode} from 'App/Models'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ForgotPasswordValidator from 'App/Validators/API/Auth/OTP/ForgotPasswordValidator'
import Event from '@ioc:Adonis/Core/Event'

export default class ForgotPasswordController {
  public async handle ({request, response}: HttpContextContract) {
    try {
      const {
        email, mobile, identifier = 'Forgot Password',
      } = await request.validate(ForgotPasswordValidator)

      const user = await User.query().whereNull('deleted_at').match(
        [email, query => query.where('email', email ?? '')],
        [mobile, query => query.where('mobile', mobile ?? '')]
      ).firstOrFail()

      const code = await VerificationCode.updateOrCreate(
        {source: email ?? mobile, userId: user.id, verifiedAt: null},
        {
          token: string.generateRandom(32),
          expiresAt: DateTime.now().plus({minute: 10}),
          code: Math.floor(1000 + Math.random() * 9000).toString(),
        }
      )

      if (code && ['production'].includes(Env.get('NODE_ENV'))) {
        try {
          Event.emit('OneTimePassword:EMAIL', {source: code.source, code: code.code})
          Event.emit('OneTimePassword:SMS', {source: code.source, identifier, code: code.code})
        } catch (error) {
          throw error
        }
      }

      response.ok({success: !!code.id, token: code.token, source: email ?? mobile, user: user.id})
    } catch (error) {
      throw error
    }
  }
}
