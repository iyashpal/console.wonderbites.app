// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Banner from 'App/Models/Banner'
import CreateValidator from 'App/Validators/Banner/CreateValidator'
import UpdateValidator from 'App/Validators/Banner/UpdateValidator'
export default class BannersController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let banners = await Banner.query().paginate(request.input('page', 1), 10)

    banners.baseUrl(request.url())

    return view.render('admin/banners/index', { banners })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/banners/create')
  }

  /**
   * Store a newly created resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const data = await request.validate(CreateValidator)
    console.log(data)
    const banner = await Banner.create(data)
      .then((banner) => {
        session.flash('banner_created', banner.id)
        return banner
      })

    response.redirect().toRoute('banners.show', { id: banner.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const banner = await Banner.findOrFail(id)

    return view.render('admin/banners/show', { banner })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const banner = await Banner.findOrFail(params.id)

    return view.render('admin/banners/edit', { banner })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const banner = await Banner.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)
    await banner.merge(data).save().then(() => session.flash('banner_updated', true))

    response.redirect().toRoute('banners.show', { id: banner.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const banner = await Banner.findOrFail(id)
    await banner.delete().then(() => {
      session.flash('banner_deleted', true)
      response.redirect().toRoute('banners.index')
    })
  }
}
