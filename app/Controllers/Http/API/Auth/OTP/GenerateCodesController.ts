import {DateTime} from 'luxon'
import {User} from 'App/Models'
import {string} from '@ioc:Adonis/Core/Helpers'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import GenerateValidator from 'App/Validators/API/Auth/OTP/GenerateValidator'

export default class GenerateCodesController {
  public async handle ({request, response}: HttpContextContract) {
    try {
      const {mobile} = await request.validate(GenerateValidator)

      const user = await User.query().where('mobile', mobile).firstOrFail()

      const code = await user.related('verificationCodes')
        .create({code: this.generateCode(5), expiresAt: DateTime.now().plus({minute: 10})})

      response.ok({success: !!code.id, user: user.id})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  protected generateCode (num = 5) {
    let code = string.generateRandom(num)

    return code.replace(/[^\w\s]/gi, Math.floor(Math.random() * 9 + 1).toString())
  }
}
