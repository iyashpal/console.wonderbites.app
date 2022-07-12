import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class WonderpointsController {
  public async index ({ }: HttpContextContract) { }

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
      .where('user_id', user.id)

    const total = (wonderpoints.total ? wonderpoints.total : 0)

    // Get total redeemed wonderpoints
    const [redeemedWonderpoints] = await Database.from('redeemed_wonderpoints').sum('points as total')
      .where('user_id', user.id)

    const redeemed = (redeemedWonderpoints.total ? redeemedWonderpoints.total : 0)

    // Return total available wonderpoints.
    response.json({ wonderpoints: total - redeemed })
  }
}
