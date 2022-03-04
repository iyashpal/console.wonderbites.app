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

  public async change_email({ view }: HttpContextContract) {
    return view.render('API/change_email')
  }

  public async delete_account({ view }: HttpContextContract) {
    return view.render('API/delete_account')
  }

  public async my_subscriptions({ view }: HttpContextContract) {
    return view.render('API/my_subscriptions')
  }

}
