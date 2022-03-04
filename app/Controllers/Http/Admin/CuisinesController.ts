import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Cuisine/CreateValidator'
import UpdateValidator from 'App/Validators/Cuisine/UpdateValidator'
import Cuisine from 'App/Models/Cuisine'

export default class CuisinesController {

  public async index({ view, request }: HttpContextContract) {

    let cuisines = await Cuisine.query().paginate(request.input('page', 1), 2)

    cuisines.baseUrl(request.url())
  
    return view.render('app/cuisines/index', { cuisines })
  }

  public async create({ view }: HttpContextContract) {

    return view.render('app/cuisines/create')

  }

  public async store({ request, response, session }: HttpContextContract) {
    const { name, description, image_path, status } = await request.validate(CreateValidator)
    if (image_path)
      await image_path.moveToDisk('./')

    const cuisine = await Cuisine.create({ name, description, image_path: image_path ? image_path.fileName : '', status })

    if (cuisine.id)
      session.flash('cuisine_created', true)

    response.redirect().toRoute('cuisines.show', { id: cuisine.id })
  }

  public async show({ view, params: { id } }: HttpContextContract) {

    const cuisine = await Cuisine.findOrFail(id)

    return view.render('app/cuisines/show', { cuisine })

  }

  public async edit({ view, params: { id } }: HttpContextContract) {
    const cuisine = await Cuisine.findOrFail(id)

    return view.render('app/cuisines/edit', { cuisine })
  }

  public async update({ request, response, params, session }: HttpContextContract) {

    const cuisine = await Cuisine.findOrFail(params.id)

    const { name, description, image_path, status } = await request.validate(UpdateValidator)

    if (image_path)
      await image_path.moveToDisk('./')

    await cuisine.merge({ name, description, image_path: image_path ? image_path.fileName : cuisine.image_path, status }).save().then(() => {
      session.flash('cuisine_created', true)
    })
    response.redirect().toRoute('cuisines.show', { id: cuisine.id })
  }


  public async destroy({ params, response, session }: HttpContextContract) {

    const cuisine = await Cuisine.findOrFail(params.id)

    await cuisine.delete().then(() => {
      session.flash('cuisine_deleted', true)
    })

    response.redirect().toRoute('cuisines.index')
  }
}
