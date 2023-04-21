import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'
import { User, VerificationCode } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GenerateValidator from 'App/Validators/API/Auth/OTP/GenerateValidator'

export default class GenerateCodesController {
  public async handle ({ request, response }: HttpContextContract) {
    try {
      const { source } = await request.validate(GenerateValidator)

      const user = await User.query().where('mobile', source).orWhere('email', source).first()

      const code = await VerificationCode.updateOrCreate(
        { source, userId: user?.id ?? null, verifiedAt: null },
        {
          token: string.generateRandom(32),
          expiresAt: DateTime.now().plus({ minute: 10 }),
          code: Math.floor(1000 + Math.random() * 9000).toString(),
        }
      )

      if (code && (/(\+355)[0-9]+$/g).test(source) && Env.get('NODE_ENV') === 'production') {
        try {
          await fetch('https://www.mybsms.vodafone.al/ws/send.json', {
            body: JSON.stringify({
              username: Env.get('SMS_USERNAME'),
              password: Env.get('SMS_PASSWORD'),
              recipients: [source],
              message: 'Dear User,\n Your OTP is '+ code.code +' for Wonderbites.\n Thanks, Wonderbites Team',
            }),
          })
        } catch (error) {
          console.log(error)
        }
      }

      response.ok({ success: !!code.id, token: code.token, source, ...(user ? {user: user.id} : {}) })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
