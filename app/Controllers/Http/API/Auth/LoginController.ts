import { User } from 'App/Models'
import Hash from '@ioc:Adonis/Core/Hash'
import ErrorJSON from 'App/Helpers/ErrorJSON'
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

      try {
        // lookup user
        const user = await User.query().where('email', email).whereNull('deleted_at').firstOrFail()

        // Verify password
        if (!(await Hash.verify(user.password, password))) {
          return response.unauthorized('Invalid credentials')
        }

        const token = await auth.use('api').generate(user)

        response.status(200).json(token)
      } catch (error) {
        return response.status(error.status).json(new ErrorJSON(error))
      }
    } catch (error) {
      response.unprocessableEntity(new ErrorJSON(error))
    }
  }
}
