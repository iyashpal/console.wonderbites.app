import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Testimonial from 'App/Models/Testimonial'
import CreateValidator from 'App/Validators/Testimonial/CreateValidator'
import UpdateValidator from 'App/Validators/Testimonial/UpdateValidator'

export default class TestimonialsController {
  /**
   * Display a listing of resources.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let testimonials = await Testimonial.query().paginate(request.input('page', 1), 2)

    testimonials.baseUrl(request.url())

    return view.render('admin/testimonials/index', { testimonials })
  }

  /**
   * Show the form for creating a new resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/testimonials/create')
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

    const testimonial = await Testimonial.create({ ...data, image_path: data.image_path!.fileName })
      .then((testimonial) => {
        session.flash('testimonial_created', testimonial.id)
        return testimonial
      })

    response.redirect().toRoute('testimonials.show', { id: testimonial.id })
  }

  /**
   * Display the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const testimonial = await Testimonial.findOrFail(id)

    return view.render('admin/testimonials/show', { testimonial })
  }

  /**
   * Show the form for editing the specified resource.
   * 
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const testimonial = await Testimonial.findOrFail(params.id)

    return view.render('admin/testimonials/edit', { testimonial })
  }

  /**
   * Update the specified resource in storage.
   * 
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const testimonial = await Testimonial.findOrFail(params.id)

    const data = await request.validate(UpdateValidator)

    if (data.image_path) {
      await data.image_path.moveToDisk('./')
    }

    await testimonial.merge({
      ...data, imagePath: data.image_path ? data.image_path.fileName : testimonial.imagePath,
    }).save().then(() => session.flash('testimonial_updated', true))

    response.redirect().toRoute('testimonials.show', { id: testimonial.id })
  }

  /**
   * Remove the specified resource from storage.
   * 
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const testimonial = await Testimonial.findOrFail(id)

    await testimonial.delete().then(() => {
      session.flash('testimonial_deleted', true)

      response.redirect().toRoute('testimonials.index')
    })
  }
}
