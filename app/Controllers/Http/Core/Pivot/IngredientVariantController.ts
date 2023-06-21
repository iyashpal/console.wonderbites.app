import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { Ingredient, Variant } from 'App/Models'

export default class IngredientVariantController {
  public async index ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({params, response}: HttpContextContract) {
    try {
      await Ingredient.query().where('id', params.ingredient_id).firstOrFail()

      const variant = await Variant.query().where('id', params.id).firstOrFail()

      await variant.related('ingredients').detach([params.ingredient_id])
      response.ok({success: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
