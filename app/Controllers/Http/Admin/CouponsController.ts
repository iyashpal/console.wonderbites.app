import Coupon from 'App/Models/Coupon'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { default as CouponCreateValidator } from 'App/Validators/Coupon/CreateValidator'
import { default as CouponUpdateValidator } from 'App/Validators/Coupon/UpdateValidator'

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

  public async store ({ request, session, response }: HttpContextContract) {
    // Validate request
    const data = await request.validate(CouponCreateValidator)

    // Create record in database
    await Coupon.create(data).then((coupon) => {
      // Set flash value for alert/notifications
      session.flash('coupon_created', coupon.id)

      // Redirect to the newly created coupon page
      response.redirect().toRoute('coupons.show', coupon)
    })
  }

  public async show ({ view, params: { id } }: HttpContextContract) {
    // Get coupon or return 404 if not exists.
    const coupon = await Coupon.findOrFail(id)

    // Return resource view file.
    return view.render('admin/coupons/show', { coupon })
  }

  public async edit ({ view, params: { id } }: HttpContextContract) {
    // Get coupon or return 404 if not exists.
    const coupon = await Coupon.findOrFail(id)
    // Return resource view file.
    return view.render('admin/coupons/edit', { coupon })
  }

  public async update ({ request, params: { id }, session, response }: HttpContextContract) {
    // Get coupon or return 404 if not exists.
    const coupon = await Coupon.findOrFail(id)

    // Validate request
    const data = await request.validate(CouponUpdateValidator)

    // Update data in database
    await coupon.merge(data).save().then((coupon) => {
      // Set session field for alert message
      session.flash('coupon_updated', true)

      // Set redirect response to coupon show page.
      response.redirect().toRoute('coupons.show', coupon)
    })
  }

  public async destroy ({ params: { id }, session, response }: HttpContextContract) {
    // Get coupon or return 404 if not exists.
    const coupon = await Coupon.findOrFail(id)

    // Execute coupon deletion process.
    await coupon.delete().then(() => {
      // Set session field for alert messages
      session.flash('coupon_deleted', true)

      // Set redirect response to coupon list page.
      response.redirect().toRoute('coupons.index')
    })
  }
}
