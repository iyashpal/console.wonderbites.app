// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
//import User from 'App/Models/User'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Orders from 'App/Models/Order'
import User from 'App/Models/User'
import CreateValidator from 'App/Validators/Orders/CreateValidator'
import UpdateValidator from 'App/Validators/Orders/UpdateValidator'
export default class OrdersController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let orders = await Orders.query().paginate(request.input('page', 1), 2)

    orders.baseUrl(request.url())

    return view.render('admin/orders/index', { orders })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    const users = await User.all()
    //const products = await Product.all()
    return view.render('admin/orders/create',{users})
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    console.log(data)
    const order = await Orders.create(data)
      .then((order) => {
        session.flash('order_created', order.id)
        return order
      })

    response.redirect().toRoute('orders.show', { id: order.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const order = await Orders.findOrFail(id)
    return view.render('admin/orders/show', { order })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const order = await Orders.findOrFail(params.id)
    const users = await User.all()
    //const products = await Product.all()
    return view.render('app/review/edit', { order ,users})
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const order = await Orders.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)
    await order.merge(data).save().then(() => session.flash('order_updated', true))
    response.redirect().toRoute('orders.show', { id: order.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const order = await Orders.findOrFail(id)
    await order.delete().then(() => {
      session.flash('order_deleted', true)
      response.redirect().toRoute('orders.index')
    })
  }
}
