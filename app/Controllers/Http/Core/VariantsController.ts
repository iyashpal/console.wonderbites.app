import { Variant } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Variants/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Variants/UpdateValidator'
import ErrorJSON from 'App/Helpers/ErrorJSON'

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

      if (payload.product_id) {
        await $variant.related('products').attach({
          [payload.product_id]: { price: payload.price },
        })
      }

      response.ok($variant)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ request, response, params }: HttpContextContract) {
    try {
      const $variant = await Variant.findOrFail(params.id)
      const { name, price, description, ...payload } = await request.validate(UpdateValidator)
      await $variant.merge({ name, price, description }).save()

      if (payload.product_id) {
        await $variant.related('products').sync({
          [payload.product_id]: { price: price },
        }, false)
      }

      response.ok($variant)
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try {
      const variant = await Variant.findOrFail(params.id)

      await variant.delete()

      response.ok({ success: true })
    } catch (error) {
      response.status(error.status).json(new ErrorJSON(error))
    }
  }
}
