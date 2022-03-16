import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { rules, schema } from '@ioc:Adonis/Core/Validator'
import ProductImages from 'App/Models/Pivot/ProductImage'
import Product from 'App/Models/Product'

export default class ProductsController {
  public async index ({ response }: HttpContextContract) {
    try {
      const products = await Product.all()

      response.status(200).json(products)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create ({ }: HttpContextContract) { }

  public async store ({ request, response }: HttpContextContract) {
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

  public async show ({ params: { id }, response }) {
    try {
      const product = await Product.findOrFail(id)

      //const images = await ProductImages.query()
       // .where('product_id', id)

      response.status(200).json(product)
    } catch (error) {
      response.unauthorized({ message: error.message })
    }
  }

  public async productbycategory ({ request, response }: HttpContextContract) {
    try {
      //const category_id = request['category_id'];
      //const products = await Product.query() .where('category_id', category_id);
      //const products = await Product.all()
      response.status(200).json(request)
    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ }: HttpContextContract) { }

  public async destroy ({ }: HttpContextContract) { }
}
