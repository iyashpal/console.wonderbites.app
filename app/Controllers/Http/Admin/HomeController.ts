import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {


    public show({ view, request }: HttpContextContract) {

        return view.render('welcome')

    }
}
