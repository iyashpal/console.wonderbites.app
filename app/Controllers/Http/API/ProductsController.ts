import { Product } from 'App/Models'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductsController {
  public async index ({ response }: HttpContextContract) {
    try {
      const products = await Product.query().preload('wishlists')

      response.status(200).json(products)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show ({ request, params: { id }, auth, response }) {
    try {
      const user = await auth.use('api').user

      const product = await Product.query()
        // Load product media if requested.
        .match([
          request.input('with', []).includes('product.media'),
          query => query.preload('media'),
        ])
        // Load product ingredients if requested.
        .match([
          request.input('with', []).includes('product.ingredients'),
          query => query.preload('ingredients'),
        ])
        // Load product reviews if requested.
        .match([
          request.input('with', []).includes('product.reviews'),
          query => query.preload('reviews'),
        ])
        // Load wishlist data if requested.
        .match([
          user?.id && request.input('with', []).includes('product.wishlist'),
          query => query.preload('wishlists', builder => builder.where('user_id', user.id)),
        ])
        .where('id', id).firstOrFail()

      response.status(200).json(product)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }

  public async toggleCategory ({ params: { id }, response, request }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    const test = await product.related('categories').attach(request.input('category_id'))

    response.json(test)
  }
}
