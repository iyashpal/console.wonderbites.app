import Testimonial from 'App/Models/Testimonial'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TestimonialsController {

  public async index({ view }: HttpContextContract) {
    let testimonials = await Testimonial.all()

    return view.render('app/testimonials/index', { testimonials })
  }

  public async create({ view }: HttpContextContract) {

    return view.render('app/testimonials/create')
  }

  public async store({ request, response }: HttpContextContract) {
    // const validated = request.validate({
    //   schema: schema.create({
    //     name: 
    //   })
    // })
    
    
    await Testimonial.create({
      name: request.input('name'),
      title: request.input('title'),
      body: request.input('body'),
      image_path: request.input('image_path'),
      status: request.input('status'),
    });

    response.redirect().toRoute('testimonials.index')
  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
