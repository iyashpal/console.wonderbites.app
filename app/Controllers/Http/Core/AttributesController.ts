import { Attribute } from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Attributes/StoreValidator'

export default class AttributesController {
  public async index ({ }: HttpContextContract) { }

  public async create ({ }: HttpContextContract) { }

  public async store ({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user!
      const payload = await request.validate(StoreValidator)

      const attribute = await Attribute.create({
        userId: user.id,
        name: payload.name,
        description: payload.description,
        price: payload.price,
        status: payload.status ?? true,
      })

      if (payload.variant_id) {
        await attribute.related('variants').attach({
          [payload.variant_id]: {
            category_id: payload.category_id,
            price: payload.price,
          },
        })
      }

      response.ok(attribute)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({ }: HttpContextContract) { }

  public async edit ({ }: HttpContextContract) { }

  public async update ({ request, response, params }: HttpContextContract) {
    try {
      const payload = await request.validate(StoreValidator)

      const attribute = await Attribute.findOrFail(params.id)

      await attribute.merge({
        name: payload.name,
        description: payload.description ?? '',
        price: payload.price,
        status: payload.status,
      }).save()

      if (payload.variant_id) {
        await attribute.related('variants').sync({
          [payload.variant_id]: {
            category_id: payload.category_id,
            price: payload.price,
          },
        })
      }

      response.ok(attribute)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try {
      const attribute = await Attribute.findOrFail(params.id)
      await attribute.delete()
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
