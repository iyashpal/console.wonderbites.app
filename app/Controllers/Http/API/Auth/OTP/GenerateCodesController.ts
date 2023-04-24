import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import Mail from '@ioc:Adonis/Addons/Mail'
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

      if (code && ['production'].includes(Env.get('NODE_ENV'))) {
        await this.sendMobileOTP(source, code.code)
        await this.sendEmailOTP(source, code.code)
      }

      response.ok({ success: !!code.id, token: code.token, source, ...(user ? { user: user.id } : {}) })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  private async sendMobileOTP (source: string, code: string) {
    try {
      const body = JSON.stringify({
        username: Env.get('SMS_USERNAME'),
        password: Env.get('SMS_PASSWORD'),
        recipients: [source],
        message: code + ' is your OTP for Wonderbites. For any questions, contact us at +355696011010.',
        'dlr-url': Env.get('APP_URL'),
      })

      if ((/(\+355)[0-9]+$/g).test(source)) {
        await fetch('https://mybsms.vodafone.al/ws/send.json', { method: 'POST', body })
      }
    } catch (error) {
      console.log(error)
    }
  }

  private async sendEmailOTP (source: string, code: string) {
    if ((/^\S+@\S+\.\S+$/).test(source)) {
      try {
        await Mail.send((message) => {
          message.to(source)
          message.subject('OTP verification for Wonderbites')
          message.from(Env.get('SMTP_FROM_ADDRESS', null), Env.get('SMTP_FROM_NAME', 'Wonderbites'))
          message.html(code + ' is your OTP for Wonderbites. For any questions, contact us at +355696011010.')
        })
      } catch (error) {
        console.log(error)
      }
    }
  }
}
