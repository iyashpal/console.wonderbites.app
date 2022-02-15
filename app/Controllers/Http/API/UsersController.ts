import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {

    public async show({ auth, response }: HttpContextContract) {

        try {
            
            await auth.use('api').authenticate()

            response.status(200).json(auth.use('api').user!);

        } catch (error) {

            response.unauthorized({message: "Unauthenticated"})

        }

    }

}
