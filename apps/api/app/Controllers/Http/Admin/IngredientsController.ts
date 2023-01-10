import Category from 'App/Models/Category'
import Ingredient from 'App/Models/Ingredient'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Ingredient/CreateValidator'
import UpdateValidator from 'App/Validators/Ingredient/UpdateValidator'

export default class IngredientsController {
  /**
   * Display a listing of resources.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async index ({ view, request }: HttpContextContract) {
    let ingredients = await Ingredient.query().paginate(request.input('page', 1), 10)

    ingredients.baseUrl(request.url())

    return view.render('admin/ingredients/index', { ingredients })
  }
  /**
   * Show the form for creating a new resource.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async create ({ view }: HttpContextContract) {
    return view.render('admin/ingredients/create')
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async store ({ request, response, session }: HttpContextContract) {
    const payload = await request.validate(CreateValidator)

    const ingredient = await Ingredient.create({
      ...payload,

      thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
    })
      .then((ingredient) => {
        session.flash('ingredient_created', ingredient.id)
        return ingredient
      })

    response.redirect().toRoute('ingredients.show', { id: ingredient.id })
  }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async show ({ view, params: { id } }: HttpContextContract) {
    const ingredient = await Ingredient.findOrFail(id)

    const categories = await Category.query().where('type', 'Ingredient')

    return view.render('admin/ingredients/show', { ingredient, categories })
  }

  /**
   * Show the form for editing the specified resource.
   *
   * @param param0 HttpContextContract
   * @returns ViewRendererContract
   */
  public async edit ({ view, params }: HttpContextContract) {
    const ingredient = await Ingredient.findOrFail(params.id)

    return view.render('admin/ingredients/edit', { ingredient })
  }

  /**
   * Update the specified resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async update ({ request, response, params, session }: HttpContextContract) {
    const ingredient = await Ingredient.findOrFail(params.id)

    const payload = await request.validate(UpdateValidator)

    await ingredient.merge({
      ...payload,

      thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : ingredient.thumbnail,
    }).save().then(() => session.flash('ingredient_updated', true))

    response.redirect().toRoute('ingredients.show', { id: ingredient.id })
  }

  /**
   * Remove the specified resource from storage.
   *
   * @param param0 HttpContextContract
   */
  public async destroy ({ params: { id }, response, session }: HttpContextContract) {
    const ingredient = await Ingredient.findOrFail(id)

    await ingredient.delete().then(() => {
      session.flash('ingredient_deleted', true)

      response.redirect().toRoute('ingredients.index')
    })
  }
}
