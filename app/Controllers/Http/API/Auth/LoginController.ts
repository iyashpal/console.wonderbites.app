import ErrorJSON from 'App/Helpers/ErrorJSON'
import {Limiter} from '@adonisjs/limiter/build/services'
import {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from 'App/Validators/API/Auth/LoginValidator'

export default class LoginController {
  /**
   * Authenticate users.
   *
   * @param param0 {HttpContextContract} Request Data
   * @returns {JSON}
   */
  public async handle ({auth, request, response}: HttpContextContract) {
    try {
      const {email, password} = await request.validate(LoginValidator)

      const throttleKey = `login_${email}_${request.ip()}`

      const limiter = Limiter.use({
        requests: 5,
        duration: '15 mins',
        blockDuration: '30 min',
      })

      if (await limiter.isBlocked(throttleKey)) {
        return response.tooManyRequests('Login attempts exhausted. Please try after some time')
      }

      try {
        const token = await auth.use('api').attempt(email, password)
        response.status(200).json(token)
      } catch (error) {
        await limiter.increment(throttleKey)
        return response.status(error.status).json(new ErrorJSON(error))
      }

      await limiter.delete(throttleKey)
    } catch (error) {
      response.unprocessableEntity(new ErrorJSON(error))
    }
  }
}
