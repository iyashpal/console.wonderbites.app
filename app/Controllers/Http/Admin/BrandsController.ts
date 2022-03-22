import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Brand from 'App/Models/Brands'
import CreateValidator from 'App/Validators/Brands/CreateValidator'
import UpdateValidator from 'App/Validators/Brands/UpdateValidator'

export default class BrandsController {
  /**
   * Display a listing of the resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let brands = await Brand.query().paginate(request.input('page', 1), 2)
    brands.baseUrl(request.url())
    return view.render('admin/brands/index', { brands })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/brands/create')
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

    const brand = await Brand.create({ ...data, imagePath: data.image_path!.fileName })
      .then((brand) => {
        session.flash('brand_updated', brand.id)
        return brand
      })

    response.redirect().toRoute('brands.show', { id: brand.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 {HttpContextContract} 
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const brand = await Brand.findOrFail(id)
    return view.render('admin/brands/show', { brand })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract 
   * @returns ViewRendererContract
   */
  public async edit ({ view, params: { id } }: HttpContextContract) {
    const brand = await Brand.findOrFail(id)

    return view.render('admin/brands/edit', { brand })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const brand = await Brand.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await brand.merge({ ...data, imagePath: data.image_path ? data.image_path.fileName : brand.imagePath })
      .save().then(() => session.flash('brand_updated', true))

    response.redirect().toRoute('brands.show', { id: brand.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params, response, session }: HttpContextContract) {
    const brand = await Brand.findOrFail(params.id)

    await brand.delete().then(() => {
      session.flash('brand_deleted', true)

      response.redirect().toRoute('brands.index')
    })
  }
}
