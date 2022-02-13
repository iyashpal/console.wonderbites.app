import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {


    public async show({ view }: HttpContextContract) {

        return await view.render('auth/login');
    }


    public async login({ auth, request }) {

        const email = request.input('email')

        const password = request.input('password')

        await auth.use('web').attempt(email, password)
    }


}
