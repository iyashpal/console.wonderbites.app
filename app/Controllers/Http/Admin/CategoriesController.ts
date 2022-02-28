import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Category/CreateValidator'
import UpdateValidator from 'App/Validators/Category/UpdateValidator'
import Cateogry from 'App/Models/Cateogry'

export default class CategoriesController {
  public async index({ view, request }: HttpContextContract) {

    let categories = await Cateogry.query().paginate(request.input('page', 1), 2)

    categories.baseUrl(request.url())

    return view.render('app/categories/index', { categories })
  }

  public async create({ view }: HttpContextContract) {

    return view.render('app/categories/create')

  }

  public async store({ request, response, session }: HttpContextContract) {
    const { parent, name, description, image_path, status } = await request.validate(CreateValidator)
    if (image_path)
      await image_path.moveToDisk('./')

    const category = await Cateogry.create({ parent, name, description, image_path: image_path!.fileName, status })

    if (category.id)
      session.flash('category_created', true)

    response.redirect().toRoute('categories.show', { id: category.id })
  }

  public async show({ view, params: { id } }: HttpContextContract) {

    const category = await Cateogry.findOrFail(id)

    return view.render('app/categories/show', { category })

  }

  public async edit({ view, params: { id } }: HttpContextContract) {
    const category = await Cateogry.findOrFail(id)

    return view.render('app/categories/edit', { category })
  }

  public async update({ request, response, params, session }: HttpContextContract) {

    const category = await Cateogry.findOrFail(params.id)

    const { parent, name, description, image_path, status } = await request.validate(UpdateValidator)

    if (image_path)
      await image_path.moveToDisk('./')

    await category.merge({ parent, name, description, image_path: image_path ? image_path.fileName : category.image_path, status }).save().then(() => {
      session.flash('category_created', true)
    })
    response.redirect().toRoute('categories.show', { id: category.id })
  }


  public async destroy({ params, response, session }: HttpContextContract) {
    const category = await Cateogry.findOrFail(params.id)

    await category.delete().then(() => {
      session.flash('category_deleted', true)
    })
    response.redirect().toRoute('categories.index')
  }
}
