import ErrorJSON from 'App/Helpers/ErrorJSON'
import { User, VerificationCode } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterValidator from 'App/Validators/API/Auth/OTP/RegisterValidator'

export default class RegisterController {
  public async handle ({auth, request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RegisterValidator)
      const verificationCode = await VerificationCode.query()
        .where('state', 'Register')
        .where('token', payload.token)
        .whereNotNull('verified_at').first()

      if (verificationCode === null) {
        return response.unprocessableEntity({ errors: { token: 'Invalid token state' } })
      }

      const user = await User.create({
        firstName: payload.firstName,
        lastName: payload.lastName,
        mobile: payload.mobile,
        email: payload.email,
        password: payload.password,
      })

      await verificationCode.delete()

      const authToken = await auth.use('api').generate(user)

      response.ok(authToken)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
