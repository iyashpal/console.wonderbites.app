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
      // Nested conditional query to load the categories data.
      const queryOnRequestInput = (query) => query.match([
        // Load products if it is requested in query string.
        request.input('with', []).includes('category.products'),
        query => query.preload('products', (builder) => builder.match([
          // Load product media if it is requested in query string.
          request.input('with', []).includes('category.products.media'),
          query => query.preload('media'),
        ])),
      ])

      const category = await Category.query().match(
        [
          request.input('type') === 'product',
          query => queryOnRequestInput(query.where('type', 'Product')),
        ],
        [
          request.input('type') === 'ingredient',
          query => queryOnRequestInput(query.where('type', 'Ingredient')),
        ],
        [
          request.input('type') === 'cuisine',
          query => queryOnRequestInput(query.where('type', 'Cuisine')),
        ],
        [
          request.input('type') === 'blog',
          query => queryOnRequestInput(query.where('type', 'Blog')),
        ],
        [
          request.input('type', 'all') === 'all',
          queryOnRequestInput,
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

  public async update ({ }: HttpContextContract) {
  }

  public async destroy ({ }: HttpContextContract) {
  }
}
