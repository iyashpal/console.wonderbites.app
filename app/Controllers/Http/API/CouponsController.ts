import Coupon from 'App/Models/Coupon'
import ApplyCouponValidator from 'App/Validators/Coupon/ApplyValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CouponsController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) { }

  public async store ({ }: HttpContextContract) { }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }

  /**
   * Apply Coupon to user cart.
   *
   * @param param0 {HttpContextContract}
   */
  public async apply ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(ApplyCouponValidator)

      const coupon = await Coupon.query().where('code', payload.coupon).first()

      if (coupon && coupon.is_valid) {
        await coupon.related('carts').sync([payload.cart], false)

        response.status(200).json({
          coupon: {
            id: coupon.id,
            code: coupon.code,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue,
          },
        })
      }

      if (coupon && coupon.is_expired) {
        response.status(422).json({ coupon: ['Coupon code is expired.'] })
      }
    } catch (error) {
      response.status(422).json(error)
    }
  }
}
