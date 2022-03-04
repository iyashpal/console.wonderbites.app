import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Testimonial from 'App/Models/Testimonial'

export default class TestimonialsController {
  
  public async index({ response }: HttpContextContract) {

    let testimonials = await Testimonial.all()

    response.json(testimonials);
  }

  public async create({ }: HttpContextContract) {

    const testimonials = new Testimonial()

    testimonials.title = "karna"
    
    testimonials.body = "hello"

    testimonials.image_path = "asdas"

    testimonials.status = 1

    await testimonials.save()

  }

  public async store({}: HttpContextContract) {}

  public async show({}: HttpContextContract) {}

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
