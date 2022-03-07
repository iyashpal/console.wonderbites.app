import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view }: HttpContextContract) {
    return view.render('welcome')
  }
}
