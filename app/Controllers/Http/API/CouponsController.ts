import { Cart, Coupon } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ApplyCouponValidator from 'App/Validators/Coupon/ApplyValidator'
import CreateCouponValidator from 'App/Validators/Coupon/CreateValidator'
import UpdateCouponValidator from 'App/Validators/Coupon/UpdateValidator'
import RemoveCouponValidator from 'App/Validators/Coupon/RemoveValidator'

export default class CouponsController {
  /**
   * List the specified resources.
   * 
   * @param param0 {HttpContextContract}
   */
  public async index ({ response }: HttpContextContract) {
    try {
      const coupons = await Coupon.all()

      response.json(coupons)
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Store a coupon to database.
   * 
   * @param param0 {HttpcontextContract}
   */
  public async store ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(CreateCouponValidator)

      const coupon = await Coupon.create(payload)

      response.json(coupon)
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Get the resource details.
   * 
   * @returns {JSON}
   */
  public async show ({ params, response }: HttpContextContract) {
    try {
      const coupon = await Coupon.findOrFail(params.id)

      response.status(200).json(coupon)
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Update the resource data.
   * 
   * @returns {JSON}
   */
  public async update ({ request, response, params }: HttpContextContract) {
    try {
      const coupon = await Coupon.findOrFail(params.id)

      const payload = await request.validate(UpdateCouponValidator)

      await coupon.merge(payload).save()

      await coupon.refresh()

      response.status(200).json(coupon)
    } catch (error) {
      response.badRequest(error)
    }
  }

  /**
   * Delete the resource from database.
   * 
   * @returns {JSON}
   */
  public async destroy ({ params, response }: HttpContextContract) {
    try {
      const coupon = await Coupon.findOrFail(params.id)

      response.json({
        deleted: await coupon.delete(),
      })
    } catch (error) {
      response.badRequest(error)
    }
  }

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
        const cart = await Cart.query().where('id', payload.cart).first()

        await cart?.merge({ couponId: coupon.id }).save()

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
        response.status(422).json({ messages: { coupon: ['Coupon code is expired.'] } })
      }
    } catch (error) {
      response.status(422).json(error)
    }
  }

  public async remove ({ request, response }: HttpContextContract) {
    try {
      const payload = await request.validate(RemoveCouponValidator)

      const cart = await Cart.query().where('id', payload.cart).first()

      await cart?.merge({ couponId: null }).save()

      response.status(200).json(cart)
    } catch (error) {
      response.status(422).json(error)
    }
  }
}
