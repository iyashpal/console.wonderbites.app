import Coupon from 'App/Models/Coupon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CouponsController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }

  public async apply ({ request, response }: HttpContextContract) {
    return response.json({ coupon: request.input('coupon') })
    // console.log('testing')
    // await Coupon.query().where('code', request.input('coupon')).firstOrFail()
    //   .then((coupon) => {
    //     console.log()
    //   })
  }
}
