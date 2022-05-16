import Application from '@ioc:Adonis/Core/Application'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Ingridient from 'App/Models/Ingridient'
import Media from 'App/Models/Media'
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
    let products = await Product.query().paginate(request.input('page', 1), 10)

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
  public async store ({ request, response, session, auth }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    await Product.create({ ...data, userId: auth.user?.id, publishedAt: data.status === 1 ? DateTime.now() : null })
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

    await product.load('media')

    await product.load('categories', (query) => query.select('id'))

    const ingridients = await Ingridient.all()

    const categories = await Category.query().where('type', 'Product')

    return view.render('admin/products/show', { product, categories, ingridients })
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

    await product.merge({ ...data, publishedAt: data.status === 1 ? DateTime.now() : null }).save()
      .then(product => {
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

  public async handleMedia ({ request, params: { id } }: HttpContextContract) {
    const product = await Product.findOrFail(id)
    const images = request.files('files')

    for (let image of images) {
      await image.move(Application.tmpPath('uploads'))

      await product.related('media').create({
        filePath: image.fileName,
      })
    }
  }
}
