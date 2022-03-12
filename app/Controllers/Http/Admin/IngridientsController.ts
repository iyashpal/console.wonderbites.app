// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Ingridient from 'App/Models/Ingridient'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Ingridient/CreateValidator'
import UpdateValidator from 'App/Validators/Ingridient/UpdateValidator'
export default class IngridientsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let ingridients = await Ingridient.query().paginate(request.input('page', 1), 2)

    ingridients.baseUrl(request.url())

    return view.render('app/ingridients/index', { ingridients })
  }
  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('app/ingridients/create')
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
    const ingridient = await Ingridient.create({ ...data, image_path: data.image_path!.fileName })
      .then((ingridient) => {
        session.flash('ingridient_created', ingridient.id)
        return ingridient
      })

    response.redirect().toRoute('ingridients.show', { id: ingridient.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const ingridient = await Ingridient.findOrFail(id)

    return view.render('app/ingridients/show', { ingridient })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const ingridient = await Ingridient.findOrFail(params.id)

    return view.render('app/ingridients/edit', { ingridient })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const ingridient = await Ingridient.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await ingridient.merge({
      ...data, image_path: data.image_path ? data.image_path.fileName : ingridient.image_path,
    }).save().then(() => session.flash('ingridient_updated', true))

    response.redirect().toRoute('ingridients.show', { id: ingridient.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const ingridient = await Ingridient.findOrFail(id)

    await ingridient.delete().then(() => {
      session.flash('ingridient_deleted', true)

      response.redirect().toRoute('ingridients.index')
    })
  }
}
