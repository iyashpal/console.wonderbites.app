import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Brands from 'App/Models/Brands'
import CareerCategory from 'App//Models/Pivot/CareerCategory'
import CreateValidator from 'App/Validators/CareerCategory/CreateValidator'
import UpdateValidator from 'App/Validators/CareerCategory/UpdateValidator'
export default class CareerCategoriesController {
/**
     * Display a listing of the resource.
     * 
     * @param param0 HttpContextContract
     * @returns ViewRendererContract
*/
  public async index ({ view, request }: HttpContextContract) {
    let careercategories = await CareerCategory.query().paginate(request.input('page', 1), 2)
    careercategories.baseUrl(request.url())
    return view.render('admin/careercategory/index', { careercategories })
  }
  /**
     * Show the form for creating a new resource.
     * 
     * @param param0 HttpContextContract 
     * @returns ViewRendererContract
     */
  public async create ({ view }: HttpContextContract) {
    const brands = await Brands.query().where('status', 1)
    return view.render('admin/careercategory/create', {brands})
  }
  /**
     * Store a newly created resource in storage.
     * 
     * @param param0 HttpContextContract 
     */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    const careercategory = await CareerCategory.create(data)
      .then((careercategory) => {
        session.flash('category_created', careercategory.id)
        return careercategory
      })
    response.redirect().toRoute('careercategories.show', { id: careercategory.id })
  }
  /**
     * Display the specified resource.
     * 
     * @param param0 {HttpContextContract} 
     * @returns ViewRendererContract
     */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const careercategory = await CareerCategory.findOrFail(id)
    return view.render('admin/careercategory/show', { careercategory })
  }

  /**
     * Show the form for editing the specified resource.
     * 
     * @param param0 HttpContextContract 
     * @returns ViewRendererContract
     */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const careercategory = await CareerCategory.findOrFail(id)
    const brands = await Brands.query().where('status', 1)
    return view.render('admin/careercategory/edit', { careercategory,brands })
  }

  /**
     * Update the specified resource in storage.
     * 
     * @param param0 HttpContextContract
     */

  public async update ({ request, response, params, session }: HttpContextContract) {
    const careercategory = await CareerCategory.findOrFail(params.id)
    const data = await request.validate(UpdateValidator)
    await careercategory.merge(data)
      .save().then(() => session.flash('category_updated', true))
    response.redirect().toRoute('careercategories.show', { id: careercategory.id })
  }
  /**
     * Remove the specified resource from storage.
     * 
     * @param param0 HttpContextContract
     */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const careercategory = await CareerCategory.findOrFail(params.id)
    await careercategory.delete().then(() => {
      session.flash('category_deleted', true)
      response.redirect().toRoute('careercategories.index')
    })
  }
}
