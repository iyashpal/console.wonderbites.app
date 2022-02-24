import Testimonial from 'App/Models/Testimonial'
import { schema, rules } from '@ioc:Adonis/Core/Validator'
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
    await request.validate({
      schema: schema.create({
        name: schema.string({ trim: true }),
        title: schema.string({ trim: true }),
        body: schema.string({ trim: true }),
        image_path: schema.file({
          size: '1mb',
          extnames: ['jpg', 'png', 'avif']
        }),
        status: schema.number()
      })
    })

    const coverImage = request.file('image_path')
    if (coverImage) {
      await coverImage.moveToDisk('./')
    }

    await Testimonial.create({
      name: request.input('name'),
      title: request.input('title'),
      body: request.input('body'),
      image_path: coverImage.fileName,
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
        // image_path: schema.file({
        //   size: '1mb',
        //   extnames: ['jpg', 'png']
        // }),
        status: schema.number()
      })
    })


    await testimonial.merge({
      name: payload.name,
      title: payload.title,
      body: payload.body,
      // image_path: "",
      status: payload.status
    }).save()

    response.redirect().toRoute('testimonials.index')
  }

  public async destroy({ }: HttpContextContract) {

  }
}
