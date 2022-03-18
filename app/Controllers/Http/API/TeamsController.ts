import Team from 'App/Models/Team'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class TeamsController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const team = await Team.all()
      response.status(200).json(team)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }
}
