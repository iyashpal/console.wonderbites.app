import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WonderpointsController {
  /**
   * Show the list of all wonderpoints.
   * 
   * @param param0 {HttpContextContract}
   */
  public async index ({ auth, request, response }: HttpContextContract) {
    // Authenticate user
    const user = await auth.use('api').authenticate()

    // Query user wonderpoints.
    const wonderpoints = await user.related('wonderpoints').query()
      .match(
        [request.input('filter') === 'earned', query => query.where('action', 'earn')],
        [request.input('filter') === 'redeem', query => query.where('action', 'redeem')],
      )
      .paginate(request.input('page', 1), request.input('limit', 10))

    // Send the json response
    response.json(wonderpoints)
  }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }

  /**
   * Avail user's available wonderpoints.
   * 
   * @param param0 
   */
  public async availWonderpoints ({ auth, response }: HttpContextContract) {
    // Get authenticated user
    const user = await auth.use('api').authenticate()

    // Get total user wonderpoints
    const [wonderpoints] = await Database.from('wonderpoints').sum('points as total')
      .where('user_id', user.id).where('action', 'earn')

    const total = (wonderpoints.total ? wonderpoints.total : 0)

    // Get total redeemed wonderpoints
    const [redeemedWonderpoints] = await Database.from('wonderpoints').sum('points as total')
      .where('user_id', user.id).where('action', 'redeem')

    const redeemed = (redeemedWonderpoints.total ? redeemedWonderpoints.total : 0)

    // Return total available wonderpoints.
    response.json({ wonderpoints: total - redeemed })
  }
}
