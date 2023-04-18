import {DateTime} from 'luxon'
import {User} from 'App/Models'
import VerificationCode from 'App/Models/VerificationCode'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import LoginValidator from 'App/Validators/API/Auth/OTP/LoginValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async handle ({auth, request, response} : HttpContextContract) {
    try {
      const {userId, code} = await request.validate(LoginValidator)
      const verificationCode = await VerificationCode.query()
        .where('user_id', userId).where('code', code).whereNull('verified_at').first()

      if (verificationCode === null) {
        return response.status(422).json({errors: {code: 'OTP is invalid'}})
      } else if (verificationCode && verificationCode.expiresAt < DateTime.now()) {
        return response.status(422).json({errors: {code: 'OTP has been expired'}})
      }

      const user = await User.find(userId)

      if (user) {
        await verificationCode.merge({verifiedAt: DateTime.now()}).save()

        const token = await auth.use('api').generate(user)

        return response.status(200).json(token)
      }

      return response.ok({message: 'OTP is invalid'})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
