import Database from '@ioc:Adonis/Lucid/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/API/WonderPoints/StoreValidator'

export default class WonderPointsController {
  /**
   * Show the list of all wonderPoints.
   * 
   * @param param0 {HttpContextContract}
   */
  public async index ({ auth, request, response }: HttpContextContract) {
    // Authenticate user
    const user = await auth.use('api').authenticate()

    // Query user wonderPoints.
    const wonderPoints = await user.related('wonderPoints').query()
      .match(
        [request.input('type', 'all') === 'all', query => query],
        [request.input('type') === 'earned', query => query.where('action', 'earn')],
        [request.input('type') === 'redeemed', query => query.where('action', 'redeem')],
      )
      .paginate(request.input('page', 1), request.input('limit', 10))

    // Send the json response
    response.json(wonderPoints)
  }

  public async store ({ auth, request, response }: HttpContextContract) {
    const user = await auth.use('api').authenticate()

    const attributes = await request.validate(StoreValidator)

    const wonderPoint = await user.related('wonderPoints').create(attributes)

    response.json(wonderPoint)
  }

  /**
   * Avail user's available wonderPoints.
   * 
   * @param param0 
   */
  public async availWonderPoints ({ auth, response }: HttpContextContract) {
    // Get authenticated user
    const user = await auth.use('api').authenticate()

    // Get total user wonderPoints
    const [wonderPoints] = await Database.from('wonder_points').sum('points as total')
      .where('user_id', user.id).where('action', 'earn')

    const total = (wonderPoints.total ? wonderPoints.total : 0)

    // Get total redeemed wonderPoints
    const [redeemedWonderPoints] = await Database.from('wonder_points').sum('points as total')
      .where('user_id', user.id).where('action', 'redeem')

    const redeemed = (redeemedWonderPoints.total ? redeemedWonderPoints.total : 0)

    // Return total available wonderPoints.
    response.json({ wonder_points: total - redeemed })
  }
}
