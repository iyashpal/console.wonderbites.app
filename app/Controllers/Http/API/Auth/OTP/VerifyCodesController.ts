import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import VerifyValidator from 'App/Validators/API/Auth/OTP/VerifyValidator'

export default class VerifyCodesController {
  public async handle ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(VerifyValidator)
      console.log(payload)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
