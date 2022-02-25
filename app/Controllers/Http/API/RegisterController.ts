import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class RegisterController {


    /**
     * Register users.
     * 
     * @param param0 {HttpContextContract} 
     * @param {JSON}
     */
    public async register({ request, response }: HttpContextContract) {

        try {

            const validated = await request.validate(RegisterUserValidator)

            const user = await User.create(validated)

            response.status(200).json(user)

        } catch (error) {

            response.badRequest(error.messages)

        }

    }
}
