import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Product from 'App/Models/Product'

export default class ProductsController {
  public async index({ response }: HttpContextContract) {
    try {

      const products = await Product.all()
      response.status(200).json(products)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
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
          status: schema.number.optional()

        })
      })
      
      const category = await Product.create(validate)

      response.status(200).json(category)

      //response.status(200).json(product)

    } catch (error) {

      response.badRequest(error.messages)

    }

    

  }

  public async show({ params, response }) {
    try {
     const { id }: { id: Number } = params;
     const product = await Product.find(id);
     response.status(200).json(product);
    } catch (error) {

      response.unauthorized({message: "Unauthenticated"})

  }

  }

  public async edit({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
