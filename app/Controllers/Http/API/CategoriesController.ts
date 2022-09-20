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
      const queryOnRequestInput = (query) => query.match(
        [
          // Load products if it is requested in query string.
          request.input('with', []).includes('category.products'),
          query => query.preload('products', (builder) => builder.match([
            // Load product media if it is requested in query string.
            request.input('with', []).includes('category.products.media'),
            query => query.preload('media'),
          ])),
        ],
        [
          // Load ingredients if it is requested in query string.
          request.input('with', []).includes('category.ingredients'),
          query => query.preload('ingredients'),
        ],
        [
          // Load cuisines if it is requested in query string.
          request.input('with', []).includes('category.cuisines'),
          query => query.preload('cuisines'),
        ],
      )

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
   * Display the specified resource.
   *
   * @param param0 HttpContextContract
   */
  public async show ({ response, params: { id }, request }: HttpContextContract) {
    try {
      const category = await Category.findOrFail(id)

      // Load products when endpoint contains with attribute.
      if (request.input('with', []).includes('products')) {
        await category.load('products', (builder) => builder.match([
          request.input('with', []).includes('products.media'),
          query => query.preload('media'),
        ]))
      }

      // Load ingredients when endpoint contains with attribute.
      if (request.input('with', []).includes('ingredients')) {
        await category.load('ingredients')
      }

      // Load cuisines when endpoint contains with attribute.
      if (request.input('with', []).includes('cuisines')) {
        await category.load('cuisines')
      }

      response.status(200).json(category)
    } catch (error) {
      response.notFound({ message: 'Category Not Found' })
    }
  }
}
