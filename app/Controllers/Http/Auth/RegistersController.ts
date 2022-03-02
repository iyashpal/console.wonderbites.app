import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RegisterUserValidator from 'App/Validators/RegisterUserValidator'

export default class RegistersController {

    public async show({ view }: HttpContextContract) {

        return await view.render('auth/register')
    }


    public async register({ request, auth, response }: HttpContextContract) {



        const validated = await request.validate(RegisterUserValidator)


        const user = await User.create(validated)


        await auth.login(user);


        return response.redirect('/')

    }
}
