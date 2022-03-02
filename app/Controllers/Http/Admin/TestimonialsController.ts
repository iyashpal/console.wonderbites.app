import Testimonial from 'App/Models/Testimonial'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Testimonial/CreateValidator'
import UpdateValidator from 'App/Validators/Testimonial/UpdateValidator'


export default class TestimonialsController {



  public async index({ view, request }: HttpContextContract) {

    let testimonials = await Testimonial.query().paginate(request.input('page', 1), 2)

    testimonials.baseUrl(request.url())

    return view.render('app/testimonials/index', { testimonials })
  }


  

  public async create({ view }: HttpContextContract) {

    return view.render('app/testimonials/create')
  }


  public async store({ request, response, session }: HttpContextContract) {

    const { name, image_path, title, body, status } = await request.validate(CreateValidator)

    if (image_path) await image_path.moveToDisk('./')

    const testimonial = await Testimonial.create({ name, title, body, image_path: image_path!.fileName, status });

    if (testimonial.id) {
      session.flash('testimonial_created', true)
    }

    response.redirect().toRoute('testimonials.show', { id: testimonial.id })
  }



  public async show({ view, params: { id } }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(id)

    return view.render('app/testimonials/show', { testimonial })
  }



  public async edit({ view, params }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(params.id)

    return view.render('app/testimonials/edit', { testimonial })
  }



  public async update({ request, response, params, session }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(params.id)


    const { name, image_path, title, body, status } = await request.validate(UpdateValidator)

    if (image_path) await image_path.moveToDisk('./')


    await testimonial.merge({ name, title, body, image_path: image_path ? image_path.fileName : testimonial.image_path, status }).save().then(() => {
      session.flash('testimonial_updated', true)
    })

    response.redirect().toRoute('testimonials.show', { id: testimonial.id })
  }



  public async destroy({ params: { id }, response, session }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(id)

    await testimonial.delete().then(() => {
      session.flash('testimonial_deleted', true)
      response.redirect().toRoute('testimonials.index')
    })
  }
}
