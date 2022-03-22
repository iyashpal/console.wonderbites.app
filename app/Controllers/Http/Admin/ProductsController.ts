import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Ingridient from 'App/Models/Ingridient'
import Product from 'App/Models/Product'
import CreateValidator from 'App/Validators/Product/CreateValidator'
import UpdateValidator from 'App/Validators/Product/UpdateValidator'
import { DateTime } from 'luxon'

export default class ProductsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let products = await Product.query().paginate(request.input('page', 1), 2)

    products.baseUrl(request.url())

    return view.render('admin/products/index', { products })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/products/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    // Mark product as published if the status is set to active
    if (data.status === 1) {
      data.publishedAt = DateTime.now()
    }

    await Product.create(data)
      .then((product) => {
        session.flash('product_created', product.id)

        return response.redirect().toRoute('products.show', product)
      })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    product.load('categories', (query) => query.select('id'))

    const ingridients = await Ingridient.all()

    console.log(product)

    const categories = await Category.query().where('type', 'Product')

    return view.render('admin/products/show', { product, categories })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)

    return view.render('admin/products/edit', { product })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    // Mark product as published if the status is set to active
    if (data.status === 1) {
      data.publishedAt = DateTime.now()
    }

    await product.merge(data).save().then(product => {
      session.flash('product_updated', true)

      response.redirect().toRoute('products.show', product)
    })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    await product.delete().then(() => {
      session.flash('product_deleted', true)

      response.redirect().toRoute('products.index')
    })
  }

  public async toggleCategory ({ params: { id }, response, request }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    const test = await product.related('categories').attach(request.input('category_id'))

    response.json(test)
    if (request.ajax()) {
    } else {
      // response.redirect().back()
    }
  }
}
