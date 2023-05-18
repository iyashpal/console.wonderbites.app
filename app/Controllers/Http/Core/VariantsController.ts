import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import { Variant } from 'App/Models'
import StoreValidator from 'App/Validators/Core/Variants/StoreValidator'

export default class VariantsController {
  public async index ({}: HttpContextContract) {}

  public async create ({ }: HttpContextContract) {

  }

  public async store ({auth, request, response }: HttpContextContract) {
    try {
      const $user = auth.use('api').user!
      const payload = await request.validate(StoreValidator)
      const $variant = await Variant.create({
        userId: $user.id,
        name: payload.name,
        price: payload.price,
        description: payload.description ?? '',
      })
      response.ok($variant)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
