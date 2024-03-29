import { DateTime } from 'luxon'
import { Category, Ingredient, Product } from 'App/Models'
import { Attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Products/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Products/UpdateValidator'

export default class ProductsController {
  public async index ({ response, request }: HttpContextContract) {
    try {
      const { page = 1, limit = 10 } = <{ page: number, limit: number }>request.all()

      const products = await Product.query().whereNull('deleted_at')
        .withCount('media')
        .orderBy('id', 'desc').paginate(page, limit)

      response.status(200).json(products)
    } catch (error) {
      throw error
    }
  }

  public async create ({ response }: HttpContextContract) {
    try {
      const categories = await Category.query()
        .whereNull('deleted_at').where('type', 'All').orWhere('type', 'Product')
        .orderBy('name', 'asc')

      response.ok({ categories })
    } catch (error) {
      throw error
    }
  }

  public async store ({ auth, request, response }: HttpContextContract) {
    try {
      const userId = auth.use('api').user?.id

      const payload = await request.validate(StoreValidator)

      const product = await Product.create({
        userId,
        sku: payload.sku,
        name: payload.name,
        type: payload.type,
        price: payload.price,
        calories: payload.calories,
        isPopular: payload.isPopular,
        description: payload.description,
        publishedAt: payload.status === 'published' ? DateTime.now() : null,
        isCustomizable: payload.isCustomizable,
        status: payload.status,
        thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
      })

      if (payload.categoryId) {
        await product.related('categories').attach([payload.categoryId])
      }

      response.json(product)
    } catch (error) {
      throw error
    }
  }

  public async show ({ params, response }: HttpContextContract) {
    try {
      const product = await Product.query()
        .preload('user')
        .preload('media', query => query.orderBy('pivot_order'))
        .preload('categories', query => query.preload('cuisines'))
        .preload('ingredients', query => query.preload('categories'))
        .preload('variants', query => query
          .withCount('ingredients')
          .preload('categories')
          .preload('ingredients')
        )
        .where('id', params.id).firstOrFail()

      const ingredients = await Ingredient.query()
        .whereNull('deleted_at')
        .preload('categories', query => query.select('id', 'name', 'type'))

      response.ok({ product, ingredients })
    } catch (error) {
      throw error
    }
  }

  public async edit ({ response, params }: HttpContextContract) {
    try {
      const product = await Product.query()
        .whereNull('deleted_at').where('id', params.id)
        .preload('categories').firstOrFail()

      const [category] = product.categories

      const categories = await Category.query()
        .whereNull('deletedAt').where('type', 'All').orWhere('type', 'Product')
        .orderBy('name', 'asc')

      response.ok({ product, categories, category })
    } catch (error) {
      throw error
    }
  }

  public async update ({ response, request, params }: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)
      const payload = await request.validate(UpdateValidator)

      await product.merge({
        sku: payload.sku,
        type: payload.type,
        name: payload.name,
        price: payload.price,
        calories: payload.calories,
        isPopular: payload.isPopular,
        description: payload.description,
        isCustomizable: payload.isCustomizable,
        publishedAt: payload.status === 'published' ? DateTime.now() : null,
        thumbnail: payload.thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : product.thumbnail,
        status: payload.status,
      }).save()

      // Update the category ID
      if (payload.categoryId) {
        await product.related('categories').sync([payload.categoryId])
      }

      // Remove all ingredients from product when product customization set to disabled
      if (payload.isCustomizable === false) {
        await product.related('ingredients').sync([])
      }

      response.ok(product)
    } catch (error) {
      throw error
    }
  }

  public async destroy ({ response, params }: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      await product.delete()

      response.ok({ success: true })
    } catch (error) {
      throw error
    }
  }
}
