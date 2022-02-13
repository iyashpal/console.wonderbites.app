import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class LoginController {


    public async show({ view }: HttpContextContract) {

        return await view.render('auth/login');
    }


    public async login({ auth, request, response, session }: HttpContextContract) {

        const { email, password } = request.all()


        try {
            await auth.use('web').attempt(email, password)
    
            return response.redirect('/')
        } catch (error) {
            session.flash('status', 'failed')

            return response.redirect('back')
        }

    }

    public async logout({ auth, response }: HttpContextContract) {

        await auth.logout()


        return response.redirect('/')
    }
}
