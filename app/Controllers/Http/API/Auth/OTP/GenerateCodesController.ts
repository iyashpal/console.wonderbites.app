import {DateTime} from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import Event from '@ioc:Adonis/Core/Event'
import {string} from '@ioc:Adonis/Core/Helpers'
import {User, VerificationCode} from 'App/Models'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import GenerateValidator from 'App/Validators/API/Auth/OTP/GenerateValidator'

export default class GenerateCodesController {
  public async handle ({request, response}: HttpContextContract) {
    try {
      const {source, identifier = ''} = await request.validate(GenerateValidator)

      const user = await User.query().where('mobile', source).orWhere('email', source).first()

      const code = await VerificationCode.updateOrCreate(
        {source, userId: user?.id ?? null, verifiedAt: null},
        {
          token: string.generateRandom(32),
          expiresAt: DateTime.now().plus({minute: 10}),
          code: Math.floor(1000 + Math.random() * 9000).toString(),
        }
      )

      if (code && ['production'].includes(Env.get('NODE_ENV'))) {
        await Event.emit('OneTimePassword:EMAIL', {source, code: code.code})
        await Event.emit('OneTimePassword:SMS', {source, identifier, code: code.code})
      }

      response.ok({success: !!code.id, token: code.token, source, ...(user ? {user: user.id} : {})})
    } catch (error) {
      throw error
    }
  }
}
