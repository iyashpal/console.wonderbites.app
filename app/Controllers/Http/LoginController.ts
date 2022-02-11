// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import View from "@ioc:Adonis/Core/View";

export default class LoginController {


    public async show() {
        
        const html = await View.render('auth/login.edge');

        return html;
    }



}
