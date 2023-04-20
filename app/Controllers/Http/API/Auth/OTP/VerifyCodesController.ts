import { DateTime } from 'luxon'
import { VerificationCode } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyValidator from 'App/Validators/API/Auth/OTP/VerifyValidator'

export default class VerifyCodesController {
  public async handle ({ request, response, params }: HttpContextContract) {
    try {
      const { code } = await request.validate(VerifyValidator)

      const verificationCode = await VerificationCode.query()
        .where('token', params.token).where('code', code).whereNull('verified_at').first()

      if (verificationCode === null) {
        return response.unprocessableEntity({ errors: { code: 'OTP is invalid' } })
      } else if (verificationCode && verificationCode.expiresAt < DateTime.now()) {
        return response.unprocessableEntity({ errors: { code: 'OTP has been expired' } })
      }

      await verificationCode.merge({
        expiresAt: DateTime.now(),
        verifiedAt: DateTime.now(),
        token: string.generateRandom(32),
        action: verificationCode.userId ? 'Login' : 'Register',
      }).save()

      response.ok({
        token: verificationCode.token,
        source: verificationCode.source,
        action: verificationCode.action,
        success: !!verificationCode.verifiedAt,
      })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
