import Category from 'App/Models/Category'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  /**
   * Display a listing of the resource.
   *
   * @param param0 HttpContextContract
   */
  public async index ({ response, request }: HttpContextContract) {
    try {
      const category = await Category.query().match(
        [
          request.input('type') === 'product',
          query => query.where('type', 'Product').preload('products', (builder) => builder.preload('media')),
        ],
        [
          request.input('type') === 'ingredient',
          query => query.where('type', 'Ingredient'),
        ],
      )

      response.status(200).json(category)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Store a newly created resource in storage.
   *
   * @param param0 HttpContextContract
   */
  public async store ({ }: HttpContextContract) { }

  /**
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ response, params: { id } }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(id)

      await category.load('products', (builder) => builder.preload('media'))

      response.status(200).json(category)
    } catch (error) {
      response.notFound({ message: 'Category Not Found' })
    }
  }

  public async categoryblog ({ response }: HttpContextContract) {
    const category = await Category.query().where('type', 'Blog')
    //category.load('blogs')
    //let category_blogs = [];

    response.status(200).json(category)
  }

  public async update ({ }: HttpContextContract) {
  }

  public async destroy ({ }: HttpContextContract) {
  }
}
