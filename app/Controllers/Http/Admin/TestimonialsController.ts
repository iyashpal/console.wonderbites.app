import Testimonial from 'App/Models/Testimonial'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Application from '@ioc:Adonis/Core/Application'


export default class TestimonialsController {

  public async index({ view }: HttpContextContract) {
    let testimonials = await Testimonial.all()

    return view.render('app/testimonials/index', { testimonials })
  }

  public async create({ view }: HttpContextContract) {

    return view.render('app/testimonials/create')
  }

  public async store({ request, response }: HttpContextContract) {
    const payload = await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }),
        title: schema.string({ trim: true }),
        body: schema.string({ trim: true }),
        image_path: schema.file({
          size: '1mb',
          extnames: ['jpg', 'png']
        }),
        status: schema.number()
      })
    })

    const file_url = await payload.image_path.move(Application.tmpPath('uploads'))



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

  public async edit({ view, params }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(params.id)

    return view.render('app/testimonials/edit', { testimonial })
  }

  public async update({ request, response, params }: HttpContextContract) {

    const testimonial = await Testimonial.findOrFail(params.id)

    const payload = await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }),
        title: schema.string({ trim: true }),
        body: schema.string({ trim: true }),
        image_path: schema.file({
          size: '1mb',
          extnames: ['jpg', 'png']
        }),
        status: schema.number()
      })
    })


    await testimonial.merge({
      name: payload.name,
      title: payload.title,
      body: payload.body,
      image_path: "",
      status: payload.status
    }).save()

    response.redirect().back();
  }

  public async destroy({ }: HttpContextContract) { }
}
