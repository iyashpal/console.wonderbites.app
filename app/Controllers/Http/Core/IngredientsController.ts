import {Category, Ingredient} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Ingredients/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Ingredients/UpdateValidator'

export default class IngredientsController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{ page: number, limit: number }>request.all()

      const ingredients = await Ingredient.query()
        .whereNull('deleted_at')
        .preload('categories')
        .paginate(page, limit)

      response.status(200).json(ingredients)
    } catch (error) {
      throw error
    }
  }

  public async create ({response}: HttpContextContract) {
    try {
      const categories = await Category.query()
        .whereNull('deleted_at').where('type', 'All').orWhere('type', 'Ingredient')

      response.ok({categories})
    } catch (error) {
      throw error
    }
  }

  public async store ({auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!

      const payload = await request.validate(StoreValidator)

      const ingredient = await Ingredient.create({
        userId: user.id,
        name: payload.name,
        unit: payload.unit,
        price: payload.price,
        quantity: payload.quantity,
        description: payload.description,
        maxQuantity: payload.max_quantity,
        minQuantity: payload.min_quantity,
        thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
      })

      if (payload.category_id) {
        await ingredient.related('categories').sync([payload.category_id])
      }

      if (payload.variant_id) {
        await ingredient.related('variants').attach({
          [payload.variant_id]: {
            price: payload.price,
            category_id: payload.category_id,
          },
        })
      }

      response.ok(ingredient)
    } catch (error) {
      throw error
    }
  }

  public async show ({response, params}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.query()
        .whereNull('deleted_at').where('id', params.id)
        .preload('user')
        .preload('categories', query => query.preload('cuisines'))
        .firstOrFail()

      response.ok({ingredient})
    } catch (error) {
      throw error
    }
  }

  public async edit ({response, params}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.query()
        .whereNull('deleted_at').where('id', params.id)
        .preload('categories')
        .firstOrFail()

      const [category] = ingredient.categories

      const categories = await Category.query()
        .whereNull('deleted_at').where('type', 'All').orWhere('type', 'Ingredient')

      response.ok({categories, ingredient, category})
    } catch (error) {
      throw error
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    try {
      const payload = await request.validate(UpdateValidator)

      const ingredient = await Ingredient.findByOrFail('id', params.id)

      await ingredient.merge({
        name: payload.name,
        price: payload.variant_id ? ingredient.price : payload.price,
        unit: payload.unit,
        quantity: payload.quantity,
        description: payload.description ?? '',
        maxQuantity: payload.max_quantity,
        minQuantity: payload.min_quantity,
        thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : ingredient.thumbnail,
      }).save()

      if (payload.category_id) {
        await ingredient.related('categories').sync([payload.category_id])
      }

      if (payload.variant_id) {
        await ingredient.related('variants').sync({
          [payload.variant_id]: {
            price: payload.price,
            category_id: payload.category_id,
          },
        })
      }

      response.ok(ingredient)
    } catch (error) {
      throw error
    }
  }

  public async destroy ({params, response}: HttpContextContract) {
    try {
      const ingredient = await Ingredient.findByOrFail('id', params.id)

      await ingredient.delete()

      response.ok({success: true})
    } catch (error) {
      throw error
    }
  }
}
