import {Cuisine} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Cuisines/StoreValidator'

export default class CuisinesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{page: number, limit: number}>request.all()

      const cuisines = await Cuisine.query().whereNull('deleted_at').paginate(page, limit)

      response.json(cuisines)
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
  }

  public async store ({auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const {name, description, thumbnail, status} = await request.validate(StoreValidator)

      const cuisine = await Cuisine.create({
        userId: user.id, name, description, status,
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
      })

      response.ok(cuisine.toObject())
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
  }

  public async show ({response}: HttpContextContract) {
    try {
      const cuisine = await Cuisine.query().whereNull('deleted_at').firstOrFail()

      response.ok(cuisine.toObject())
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
  }

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
