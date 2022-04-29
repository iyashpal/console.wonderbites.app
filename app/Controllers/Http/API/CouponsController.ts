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
    await Coupon.query().where('code', request.input('coupon')).firstOrFail()
      .then(async (coupon) => {
        if (coupon.is_valid) {
          await coupon.related('carts').attach([request.input('cart')])
        }
        response.json({ coupon })
      })
  }
}
