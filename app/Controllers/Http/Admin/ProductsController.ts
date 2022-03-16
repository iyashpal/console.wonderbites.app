// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import CategoryProduct from 'App/Models/Pivot/CategoryProduct'
import Product from 'App/Models/Product'
import CreateValidator from 'App/Validators/Product/CreateValidator'
import UpdateValidator from 'App/Validators/Product/UpdateValidator'
///import { isDate } from '@vue/shared'
//import { CountertopsIcon } from '@materialicons/vue/round'
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

    return view.render('app/products/index', { products })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    const categories = await Category.all()
    return view.render('app/products/create',{categories})
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    const product = await Product.create({ ...data, image_path: data.image_path!.fileName })
      .then((product) => {
        session.flash('product_created', product.id)
        return product
      })
    if(request.input('category_id')){
      const categories = request.input('category_id')
      for(let i in categories) {
        await CategoryProduct.create({category_id: categories[i] , product_id : product.id })
      }
    }
    response.redirect().toRoute('products.show', { id: product.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    return view.render('app/products/show', { product })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)
    const categoryproducts = await CategoryProduct.query().where('product_id',params.id)
    const categories = await Category.all()
    return view.render('app/products/edit', { product, categoryproducts,categories })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const product = await Product.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await product.merge({
      ...data, image_path: data.image_path ? data.image_path.fileName : product.image_path,
    }).save().then(() => session.flash('product_updated', true))
    if(request.input('category_id')){
      const categories = request.input('category_id')
      for(let i in categories) {
        await CategoryProduct.create({category_id: categories[i] , product_id : product.id })
      }
    }
    response.redirect().toRoute('products.show', { id: product.id })
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
}
