import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class AppController {
  protected async handle({view}: HttpContextContract) {
    return view.render('app')
  }
}
