// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import View from "@ioc:Adonis/Core/View";

export default class LoginController {


    public async show() {

        const html = await View.render('auth/login.edge');

        return html;
    }


    public async login({ auth, request }) {

        const email = request.input('email')

        const password = request.input('password')


        console.log(email, password);

        // await auth.use('web').attempt(email, password)
    }


}
