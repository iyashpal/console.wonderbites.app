import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { schema, rules } from "@ioc:Adonis/Core/Validator"
import Cuisine from 'App/Models/Cuisine'

export default class CuisinesController {
  public async index({ response }: HttpContextContract) {
    try {
      const cuisines = await Cuisine.all()
      console.log(cuisines)
      response.status(200).json(cuisines)

    } catch (error) {
      response.badRequest(error.messages)
    }
  }

  public async create({ }: HttpContextContract) { }

  public async store({ request, response }: HttpContextContract) {
    try {
      const validate = await request.validate({
        schema: schema.create({

          name: schema.string({ trim: true }, [rules.maxLength(255)]),

          description: schema.string({ trim: true }, [rules.maxLength(255)]),

          image_path: schema.string({ trim: true }, [rules.maxLength(255)]),

          status: schema.number.optional()

        })
      })
      const cuisine = await Cuisine.create(validate)
      response.status(200).json(cuisine)

    } catch (error) {

      response.badRequest(error.messages)

    }
  }

  public async show({ }: HttpContextContract) { }

  public async edit({ }: HttpContextContract) { }

  public async update({ }: HttpContextContract) { }

  public async destroy({ }: HttpContextContract) { }
}
