import {DateTime} from 'luxon'
import {Category, Cuisine} from 'App/Models'
import {types} from '@ioc:Adonis/Core/Helpers'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Cuisines/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Cuisines/UpdateValidator'

export default class CuisinesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{ page: number, limit: number }>request.all()

      const cuisines = await Cuisine.query().preload('user').whereNull('deleted_at').paginate(page, limit)

      response.json(cuisines)
    } catch (error) {
      throw error
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

      response.ok(cuisine)
    } catch (error) {
      throw error
    }
  }

  public async edit ({response, params}: HttpContextContract) {
    try {
      const cuisine = await Cuisine.query().where('id', params.id).whereNull('deleted_at').firstOrFail()
      response.ok({cuisine})
    } catch (error) {
      throw error
    }
  }

  public async show ({response, params}: HttpContextContract) {
    try {
      const cuisine = await Cuisine
        .query()
        .preload('user', query => query.select('id', 'first_name', 'last_name'))
        .preload('categories', query => query.select('id', 'name'))
        .where('id', params.id).whereNull('deleted_at').firstOrFail()

      const categories = await Category.query().select('id', 'name').whereNull('deleted_at')

      response.ok({cuisine, categories})
    } catch (error) {
      throw error
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    try {
      const {name, description, thumbnail, status} = await request.validate(UpdateValidator)

      const cuisine = await Cuisine.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      await cuisine.merge({
        name, status,
        description: description ?? '',
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : cuisine.thumbnail,
      }).save()

      response.ok(cuisine)
    } catch (error) {
      throw error
    }
  }

  public async destroy ({request, response, params}: HttpContextContract) {
    try {
      const {force = false} = <{ force: boolean }>request.all()

      const cuisine = await Cuisine.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      if (force) {
        await cuisine.delete()

        response.ok({deleted: true})
      } else {
        await cuisine.merge({deletedAt: DateTime.now()}).save()

        response.ok({deleted: !types.isNull(cuisine.deletedAt)})
      }
    } catch (error) {
      throw error
    }
  }

  public async categories ({request, response, params}: HttpContextContract) {
    try {
      let cuisine = await Cuisine.query().where('id', params.id).whereNull('deleted_at').firstOrFail()

      const {action, categories} = request.all() as { action: string, categories: number[] }

      switch (action) {
        case 'attach':
          await cuisine.related('categories').attach(categories)
          break

        case 'detach':
          await cuisine.related('categories').detach(categories)
          break
      }

      await cuisine.load('categories')

      return response.json({cuisine})
    } catch (error) {
      throw error
    }
  }
}
