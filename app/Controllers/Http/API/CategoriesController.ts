import Product from 'App/Models/Product'
import Category from 'App/Models/Category'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CategoriesController {
  
  public async index({ response }: HttpContextContract) {
    try {

      const category = await Category.all()

      response.status(200).json(category)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create({ }: HttpContextContract) { }


  // public async store({ request, response }: HttpContextContract) {
  //   try {

  //     const validate = await request.validate({

  //       schema: schema.create({

  //         parent: schema.number.optional(),

  //         name: schema.string({ trim: true }, [rules.maxLength(255)]),

  //         description: schema.string({ trim: true }, [rules.maxLength(255)]),

  //         image_path: schema.string({ trim: true }, [rules.maxLength(255)]),

  //         status: schema.number.optional()

  //       })
  //     })

  //     const category = await Category.create(validate)

  //     response.status(200).json(category)

  //   } catch (error) {

  //     response.badRequest(error.messages)

  //   }
  // }
  public async show({ response, params }: HttpContextContract) {
    try{ 
    const category_id = params.id;
    await Category.findOrFail(category_id)
    const products = await Product
    .query() 
     .where('category_id', category_id);

    response.status(200).json(products)

  } catch (error) {

    response.notFound({ message: "Category Not Found" });

  
  }
}
  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
