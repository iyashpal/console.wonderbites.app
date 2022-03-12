// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Banner from 'App/Models/Banner'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class BannersController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const banner = await Banner.all()
      response.status(200).json(banner)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
  public async show ({ params: { id }, response }) {
    try {
      const banner = await Banner.findOrFail(id)
      response.status(200).json(banner)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }
}