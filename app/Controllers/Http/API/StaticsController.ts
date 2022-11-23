import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StaticsController {
  public async about ({ view }: HttpContextContract) {
    return view.render('static/about')
  }

  public async privacyPolicy ({ view }: HttpContextContract) {
    return view.render('static/privacy-policy')
  }

  public async contentPolicy ({ view }: HttpContextContract) {
    return view.render('static/content-policy')
  }

  public async termsOfServices ({ view }: HttpContextContract) {
    return view.render('static/terms-of-service')
  }
}
