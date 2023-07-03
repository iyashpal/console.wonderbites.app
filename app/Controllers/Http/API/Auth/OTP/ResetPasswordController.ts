import { DateTime } from 'luxon'
import Env from '@ioc:Adonis/Core/Env'
import { string } from '@ioc:Adonis/Core/Helpers'
import { User, VerificationCode } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GenerateValidator from 'App/Validators/API/Auth/OTP/GenerateValidator'
import OTP from 'App/Helpers/OTP'
import ErrorJSON from 'App/Helpers/ErrorJSON'
import VerifyValidator from 'App/Validators/API/Auth/OTP/VerifyValidator'

export default class ResetPasswordController {
  public async store ({ request, response }: HttpContextContract) {
    try {
      const { source, identifier } = await request.validate(GenerateValidator)

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
        await (new OTP()).viaMail(source, code.code)
        await (new OTP()).viaSMS(source, code.code, identifier ?? '')
      }

      response.ok({ success: !!code.id, token: code.token, source, ...(user ? { user: user.id } : {}) })
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  public async update ({ request, response, params }: HttpContextContract) {
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
        state: verificationCode.userId ? 'Login' : 'Register',
      }).save()

      response.ok({
        token: verificationCode.token,
        source: verificationCode.source,
        state: verificationCode.state,
        success: !!verificationCode.verifiedAt,
      })
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
