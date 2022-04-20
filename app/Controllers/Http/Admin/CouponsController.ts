import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Coupon from 'App/Models/Coupon'
import { default as CouponCreateValidator } from 'App/Validators/Coupon/CreateValidator'

export default class CouponsController {
  public async index ({ view, request }: HttpContextContract) {
    // load the coupon from database.
    const coupons = await Coupon.query().paginate(request.input('page', 1), 10)

    // Set the pagination base url
    coupons.baseUrl(request.url())

    return view.render('admin/coupons/index', { coupons })
  }

  public async create ({ view }: HttpContextContract) {
    return view.render('admin/coupons/create')
  }

  public async store ({ request }: HttpContextContract) {
    const data = await request.validate(CouponCreateValidator)
  }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
