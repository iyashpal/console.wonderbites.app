import { Variant } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Variants/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Variants/UpdateValidator'

export default class VariantsController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) {

  }

  public async store ({ auth, request, response }: HttpContextContract) {
    try {
      const $user = auth.use('api').user!
      const payload = await request.validate(StoreValidator)
      const $variant = await Variant.create({
        userId: $user.id,
        name: payload.name,
        price: payload.price,
        description: payload.description ?? '',
      })

      if (payload.productId) {
        await $variant.related('products').attach([payload.productId])
      }

      response.ok($variant)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ request, response, params }: HttpContextContract) {
    try {
      const $variant = await Variant.findOrFail(params.id)
      const { name, price, description } = await request.validate(UpdateValidator)
      await $variant.merge({ name, price, description }).save()
      response.ok($variant)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({ }: HttpContextContract) { }
}
