import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Category from 'App/Models/Category'
import Cuisine from 'App/Models/Cuisine'
import CreateValidator from 'App/Validators/Cuisine/CreateValidator'
import UpdateValidator from 'App/Validators/Cuisine/UpdateValidator'

export default class CuisinesController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let cuisines = await Cuisine.query().paginate(request.input('page', 1), 2)

    cuisines.baseUrl(request.url())

    return view.render('admin/cuisines/index', { cuisines })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    const categories = await Category.query().apply(scope => scope.forCuisine())
    return view.render('admin/cuisines/create', { categories })
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

      Object.assign(data, { imagePath: data.image_path!.fileName })
    }

    await Cuisine.create({ ...data }).then(async (cuisine) => {
      session.flash('cuisine_created', cuisine.id)

      await cuisine.related('categories').attach(request.input('category_id', []))

      response.redirect().toRoute('cuisines.show', { id: cuisine.id })
    })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(id)

    await cuisine.load('categories')

    return view.render('admin/cuisines/show', { cuisine })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(id)

    await cuisine.load('categories')

    const categories = await Category.query().apply(scope => scope.forCuisine())

    return view.render('admin/cuisines/edit', { cuisine, categories })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')

      Object.assign(data, { imagePath: data.image_path!.fileName })
    }

    await cuisine.merge(data).save().then(() => {
      session.flash('cuisine_created', true)
      response.redirect().toRoute('cuisines.show', { id: cuisine.id })
    })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(params.id)

    await cuisine.delete().then(() => {
      session.flash('cuisine_deleted', true)

      response.redirect().toRoute('cuisines.index')
    })
  }
}
