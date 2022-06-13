import { Product } from 'App/Models'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ProductsController {
  public async index ({ response, auth }: HttpContextContract) {
    try {
      const products = await Product.query().preload('wishlists')

      response.status(200).json(products)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create ({ }: HttpContextContract) { }

  public async store ({ request, response, auth }: HttpContextContract) {
    try {
      const validate = await request.validate({
        schema: schema.create({
          name: schema.string({ trim: true }, [rules.maxLength(255)]),
          category_id: schema.number.optional(),
          short_description: schema.string({ trim: true }, [rules.maxLength(255)]),
          description: schema.string({ trim: true }, [rules.maxLength(255)]),
          calories: schema.string({ trim: true }, [rules.maxLength(255)]),
          price: schema.string({ trim: true }, [rules.maxLength(20)]),
          image_path: schema.string({ trim: true }, [rules.maxLength(255)]),
          status: schema.number.optional(),
        }),
      })

      const product = await Product.create(validate)

      response.status(200).json(product)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async show ({ params: { id }, auth, response }) {
    try {
      const user = await auth.use('api').user

      const product = await Product.findOrFail(id)

      await product.load(loader => {
        loader.load('media', (query) => query.select('id', 'file_path'))
          .load('wishlists', (builder) => {
            if (user?.id) {
              builder.where('user_id', user.id)
            }
          })
      })

      response.status(200).json(product)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }

  public async toggleCategory ({ params: { id }, response, request }: HttpContextContract) {
    const product = await Product.findOrFail(id)

    const test = await product.related('categories').attach(request.input('category_id'))

    response.json(test)
  }
}
