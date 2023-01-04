import { DateTime } from 'luxon'
import Product from 'App/Models/Product'
import Category from 'App/Models/Category'
import Ingredient from 'App/Models/Ingredient'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Product/CreateValidator'
import UpdateValidator from 'App/Validators/Product/UpdateValidator'

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

    await Product.create({ ...data, user_id: auth.user?.id, published_at: data.status === 1 ? DateTime.now() : null })
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

    const ingridients = await Ingredient.all()

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

    await product.merge({ ...data, published_at: data.status === 1 ? DateTime.now() : null }).save()
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

    for (let image of request.files('files')) {
      await product.related('media').create({
        attachment: Attachment.fromFile(image),
      })
    }
  }
}
