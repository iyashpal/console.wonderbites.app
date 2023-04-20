import { DateTime } from 'luxon'
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
          code: Math.floor((Math.random() * 9999) + 50).toString(),
        }
      )

      response.ok({ success: !!code.id, token: code.token, source, ...(user ? {user: user.id} : {}) })
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
