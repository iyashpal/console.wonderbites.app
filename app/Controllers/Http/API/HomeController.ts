import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {

  public async about({ view }: HttpContextContract) {
    return view.render('API/about')
  }

  public async terms({ view }: HttpContextContract) {
    return view.render('API/terms')
  }

  public async privacy_policy({ view }: HttpContextContract) {
    return view.render('API/privacy_policy')
  }

  public async content_policy({ view }: HttpContextContract) {
    return view.render('API/content_policy')
  }

  public async settings({ view }: HttpContextContract) {
    return view.render('API/settings')
  }

  public async my_subscriptions({ view }: HttpContextContract) {
    return view.render('API/my_subscriptions')
  }

}
