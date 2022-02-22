import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Cateogry from 'App/Models/Cateogry'

export default class CateogriesController {
  public async index({ response }: HttpContextContract) {
    try {

      const category = await Cateogry.all()
      response.status(200).json(category)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create({ }: HttpContextContract) { }


  public async store({ request, response }: HttpContextContract) {
    try {

      const validate = await request.validate({

        schema: schema.create({

          parent: schema.number.optional(),

          name: schema.string({ trim: true }, [rules.maxLength(255)]),

          description: schema.string({ trim: true }, [rules.maxLength(255)]),

          image_path: schema.string({ trim: true }, [rules.maxLength(255)]),

          status: schema.number.optional()

        })
      })
      
      const category = await Cateogry.create(validate)

      response.status(200).json(category)

    } catch (error) {

      response.badRequest(error.messages)

    }
  }


  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
