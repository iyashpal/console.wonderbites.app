import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import CreateValidator from 'App/Validators/Category/CreateValidator'
import UpdateValidator from 'App/Validators/Category/UpdateValidator'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let categories = await Category.query().paginate(request.input('page', 1), 2)

    categories.baseUrl(request.url())

    return view.render('admin/categories/index', { categories })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/categories/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract 
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)

    const category = await Category.create({ ...data })
      .then((category) => {
        session.flash('category_created', category.id)
        return category
      })

    response.redirect().toRoute('categories.show', { id: category.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const category = await Category.findOrFail(id)
    return view.render('admin/categories/show', { category })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const category = await Category.findOrFail(id)

    return view.render('admin/categories/edit', { category })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    // if (data.image_path) {
    //   await data.image_path.moveToDisk('./')
    // }

    await category.merge({ ...data })
      .save().then(() => session.flash('category_created', true))

    response.redirect().toRoute('categories.show', { id: category.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const category = await Category.findOrFail(params.id)

    await category.delete().then(() => {
      session.flash('category_deleted', true)

      response.redirect().toRoute('categories.index')
    })
  }
}
