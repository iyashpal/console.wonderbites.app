import Category from 'App/Models/Category'
import OpeningPosition from 'App/Models/OpeningPosition'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/OpeningPosition/CreateValidator'
import UpdateValidator from 'App/Validators/OpeningPosition/UpdateValidator'
export default class OpeningPositionsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let openingpositions = await OpeningPosition.query().paginate(request.input('page', 1), 2)

    openingpositions.baseUrl(request.url())
    let categories = await Category.query().where('type', 'Blog')

    return view.render('admin/openingpositions/index', { openingpositions,categories })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    //const careercategories = await .query().where('status', 1)
    return view.render('admin/openingpositions/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session}: HttpContextContract) {
    console.log('Asaas')
    const data = await request.validate(CreateValidator)
    await OpeningPosition.create({...data})
      .then((openingposition) => {
        session.flash('job_created', openingposition.id)

        return response.redirect().toRoute('openingpositions.show', openingposition)
      })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(id)
    await openingposition.load('categories')
    //openingposition.load('career_categories', (query) => query.select('id'))
    const categories = await Category.query().where('type', 'job')

    return view.render('admin/openingpositions/show', {openingposition,categories})
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(params.id)
    //const careercategories = await CareerCategory.query().where('status', 1)
    return view.render('admin/openingpositions/edit', { openingposition})
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    await openingposition.merge(data).save()
      .then(openingposition => {
        session.flash('job_updated', true)

        response.redirect().toRoute('openingpositions.show', openingposition)
      })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async toggleCategory ({ params: { id }, request }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(id)

    await openingposition.related('categories').sync(request.input('categories'))
  }

  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const openingposition = await OpeningPosition.findOrFail(id)
    await openingposition.delete().then(() => {
      session.flash('job_deleted', true)
      response.redirect().toRoute('openingpositions.index')
    })
  }
}
