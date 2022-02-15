import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {

    /**
     * Authenticate users.
     * 
     * @param param0 {HttpContextContract} Request Data
     * @returns {JSON}
     */
    public async login({ auth, request, response }: HttpContextContract) {

        const { email, password } = request.all();

        try {

            const token = await auth.use('api').attempt(email, password)

            return response.status(200).json(token);

        } catch {

            return response.badRequest({ message: "Credentials not found." })

        }

    }

    public async logout({ auth, response }: HttpContextContract) {

        try {
            await auth.use('api').authenticate()
            await auth.use('api').revoke()
            response.status(200).json({ message: "User logout" });
        } catch (error) {
            response.unauthorized({ message: "Unauthenticated" })

        }

    }

}
