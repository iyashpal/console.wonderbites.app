import Cuisine from 'App/Models/Cuisine'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Cuisine/CreateValidator'
import UpdateValidator from 'App/Validators/Cuisine/UpdateValidator'
import Category from 'App/Models/Category'
import CategoryCuisine from 'App/Models/Pivot/CategoryCuisine'

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

    return view.render('app/cuisines/index', { cuisines })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async create({ view }: HttpContextContract) {
    const categories = await Category.all()
    return view.render('app/cuisines/create', { categories })
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

    const cuisine = await Cuisine.create({ ...data, image_path: data.image_path!.fileName })
      .then((cuisine) => {
        session.flash('cuisine_created', cuisine.id)
        return cuisine
      })
    if (request.input('category_id')) {
      const categories = request.input('category_id')
      console.log(categories)
      for (let i in categories) {
        await CategoryCuisine.create({ category_id: categories[i], cuisine_id: cuisine.id })
      }
    }
    response.redirect().toRoute('cuisines.show', { id: cuisine.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(id)

    return view.render('app/cuisines/show', { cuisine })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(id)

    return view.render('app/cuisines/edit', { cuisine })
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
    }

    await cuisine.merge({ ...data, image_path: data.image_path ? data.image_path.fileName : cuisine.image_path })
      .save().then(() => session.flash('cuisine_created', true))

    response.redirect().toRoute('cuisines.show', { id: cuisine.id })
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
