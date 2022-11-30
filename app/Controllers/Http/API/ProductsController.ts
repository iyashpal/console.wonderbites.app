import { Product } from 'App/Models'
import { ProductQuery } from 'App/Helpers/Database'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductsController {
  /**
   * Get the list of products.
   * 
   * @param param0 HttpContextContract
   */
  public async index ({ request, response, auth }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      let QueryBuilder = (new ProductQuery(request))
        .asUser(user)
        .resolveQueryWithPrefix('products')

      const products = await QueryBuilder.query()
        .orderBy('id', 'desc').paginate(request.input('page'), request.input('limit', 10))

      response.status(200).json(products)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  /**
   * Get the product details.
   * 
   * @param param0 HttpContextContract
   */
  public async show ({ request, params: { id }, auth, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const QueryBuilder = (new ProductQuery(request))
        .asUser(user)
        .qsPrefix('product')
        .withCounts(['reviews'])
        .withAggregates(['reviews'])
        .withFilters(['by-categories', 'search', 'top-rated'])
        .withPreloads(['user-wishlist', 'media', 'reviews', 'ingredients'])

      const product = await QueryBuilder.$query.where('id', id).firstOrFail()

      response.status(200).json(product)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }

  /**
   * Toggle the product categories.
   * 
   * @param param0 HttpContextContract
   */
  public async toggleCategory ({ params: { id }, response, request }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    const test = await product.related('categories').attach(request.input('category_id'))

    response.json(test)
  }
}
