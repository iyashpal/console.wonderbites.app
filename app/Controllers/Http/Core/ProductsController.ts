import {Category, Ingredient, Product} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import CreateValidator from 'App/Validators/Core/Products/CreateValidator'
import UpdateValidator from 'App/Validators/Core/Products/UpdateValidator'

export default class ProductsController {
  public async index ({response, request}: HttpContextContract) {
    const {page = 1, limit = 10} = <{ page: number, limit: number }>request.all()

    const products = await Product.query().whereNull('deleted_at')
      .withCount('media')
      .orderBy('id', 'desc').paginate(page, limit)

    response.status(200).json(products)
  }

  public async create ({response}: HttpContextContract) {
    try {
      const categories = await Category.query()
        .whereNull('deleted_at').where('type', 'All').orWhere('type', 'Product')
        .orderBy('name', 'asc')

      response.ok({categories})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async store ({auth, request, response}: HttpContextContract) {
    try {
      const userId = auth.use('api').user?.id

      const {
        name, price, description, sku, publishedAt, categoryId, thumbnail,
      } = await request.validate(CreateValidator)

      const product = await Product.create({
        sku, name, price, userId, publishedAt, description,
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : null,
      })

      if (categoryId) {
        await product.related('categories').attach([categoryId])
      }

      response.json(product)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({params, response}: HttpContextContract) {
    try {
      const product = await Product.query()
        .preload('user')
        .preload('media', query => query.orderBy('pivot_order'))
        .preload('categories', query => query.preload('cuisines'))
        .preload('ingredients', query => query.preload('categories'))
        .where('id', params.id).firstOrFail()

      const ingredients = await Ingredient.query()
        .whereNull('deleted_at')
        .preload('categories', query => query.select('id', 'name', 'type'))

      response.ok({product, ingredients})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async edit ({response, params}: HttpContextContract) {
    try {
      const product = await Product.query()
        .whereNull('deleted_at').where('id', params.id)
        .preload('categories').firstOrFail()

      const [category] = product.categories

      const categories = await Category.query()
        .whereNull('deletedAt').where('type', 'All').orWhere('type', 'Product')
        .orderBy('name', 'asc')

      response.ok({product, categories, category})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({response, request, params}: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)
      const {
        name, price, sku, description, publishedAt, thumbnail, categoryId,
      } = await request.validate(UpdateValidator)

      await product.merge({
        name, price, sku, description, publishedAt,
        thumbnail: thumbnail ? Attachment.fromFile(request.file('thumbnail')!) : product.thumbnail,
      }).save()

      if (categoryId) {
        await product.related('categories').attach([categoryId])
      }
      response.ok(product)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({response, params}: HttpContextContract) {
    try {
      const product = await Product.findByOrFail('id', params.id)

      await product.delete()

      response.ok({success: true})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }
}
