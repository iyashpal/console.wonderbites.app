import {DateTime} from 'luxon'
import {Category} from 'App/Models'
import {types} from '@ioc:Adonis/Core/Helpers'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Categories/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Categories/UpdateValidator'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'

export default class CategoriesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{ page: number, limit: number }>request.all()

      const categories = await Category.query().whereNull('deleted_at').paginate(page, limit)

      response.json(categories)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async create ({response}: HttpContextContract) {
    const categories = await Category.query().withScopes(scopes => scopes.root())
    response.json({categories})
  }

  public async store ({request, response}: HttpContextContract) {
    try {
      const {name, description, type, parent, status} = await request.validate(StoreValidator)

      const category = await Category.create({
        name, description, type, parent, status,
        thumbnail: Attachment.fromFile(request.file('thumbnail')!),
      })

      response.json(category)
    } catch (error) {
      console.log(error)
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({response, params}: HttpContextContract) {
    try {
      const category = await Category.query()
        .preload('category')
        .where('id', params.id).whereNull('deleted_at').firstOrFail()
      response.json({category})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async edit ({response, params}: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
      const categories = await Category.query().where('id', '<>', params.id).withScopes(scopes => scopes.root())
      response.json({category, categories})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      const {name, type, parent, status, description, thumbnail} = await request.validate(UpdateValidator)

      await category.merge({
        name, type, parent, status, description: description ?? '',
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : category.thumbnail,
      }).save()

      response.json(category)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({request, response, params}: HttpContextContract) {
    try {
      const {force = false} = <{ force: boolean }>request.all()

      const category = await Category.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      if (force) {
        await category.delete()

        response.ok({deleted: true})
      } else {
        await category.merge({deletedAt: DateTime.now()}).save()

        response.ok({deleted: !types.isNull(category.deletedAt)})
      }
    } catch (errors) {
      ExceptionResponse.use(errors).resolve(response)
    }
  }
}
