import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class HomeController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ inertia }: HttpContextContract) {
    return inertia.render('Dashboard')
  }
}
