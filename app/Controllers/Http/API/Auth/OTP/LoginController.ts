import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import VerificationCode from 'App/Models/VerificationCode'
import LoginValidator from 'App/Validators/API/Auth/OTP/LoginValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {
  public async handle ({ auth, request, response }: HttpContextContract) {
    try {
      const { token } = await request.validate(LoginValidator)
      const verificationCode = await VerificationCode.query()
        .preload('user').where('token', token).where('state', 'Login').whereNotNull('verified_at').first()

      if (verificationCode === null) {
        return response.unprocessableEntity({ errors: {token: 'Invalid token state'} })
      }

      const authToken = await auth.use('api').generate(verificationCode.user)

      response.status(200).json(authToken)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
