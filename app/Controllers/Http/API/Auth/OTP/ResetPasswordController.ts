import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { VerificationCode } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResetPasswordValidator from 'App/Validators/API/Auth/OTP/ResetPasswordValidator'

export default class ResetPasswordController {
  public async handle ({ request, response, params}: HttpContextContract) {
    try {
      const { code, password } = await request.validate(ResetPasswordValidator)

      const verificationCode = await VerificationCode.query()
        .where('token', params.token).where('code', code).whereNull('verified_at').firstOrFail()

      if (verificationCode && verificationCode.expiresAt < DateTime.now()) {
        return response.unprocessableEntity({ errors: { code: 'OTP has been expired' } })
      }
      await verificationCode.related('user').query()
        .update({ password: (await Hash.make(password)) })

      await verificationCode.delete()

      response.ok({ success: true})
    } catch (error) {
      throw error
    }
  }
}
