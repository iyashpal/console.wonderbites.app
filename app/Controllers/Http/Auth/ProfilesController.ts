import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProfilesController {

    public async user({ auth, response }: HttpContextContract) {
        try {
            const user = await auth.use('web').authenticate()

            
        } catch (error) {

        }
    }

}