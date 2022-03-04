import LoginUserValidator from 'App/Validators/LoginUserValidator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class LoginController {

    /**
     * Authenticate users.
     * 
     * @param param0 {HttpContextContract} Request Data
     * @returns {JSON}
     */
    public async login({ auth, request, response }: HttpContextContract) {

        const { email, password } = await request.validate(LoginUserValidator)

        try {

            const token = await auth.use('api').attempt(email, password)

            return response.status(200).json(token);

        } catch {

            return response.badRequest({ message: "Credentials not found." })

        }

    }

    /**
     * Revoke API token of logged in user.
     * 
     * @param param0 HttpContextContract
     * 
     * @return {JSON}
     */
    public async logout({ auth, response }: HttpContextContract) {

        try {

            await auth.use('api').revoke()

            response.status(200).json({ revoked: true });

        } catch (error) {

            response.badRequest(error.messages)
            
        }

    }

}
