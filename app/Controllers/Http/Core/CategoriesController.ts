import {Category} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Categories/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Categories/UpdateValidator'

export default class CategoriesController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = <{ page: number, limit: number }>request.all()

      const categories = await Category.query().paginate(page, limit)

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
      const payload = await request.validate(StoreValidator)

      const category = await Category.create(payload)

      response.json(category)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({request, response}: HttpContextContract) {
    //
  }

  public async edit ({request, response, params}: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).firstOrFail()
      const categories = await Category.query().withScopes(scopes => scopes.root())
      response.json({category, categories})
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({request, response, params}: HttpContextContract) {
    try {
      const category = await Category.query().where('id', params.id).firstOrFail()

      const payload = await request.validate(UpdateValidator)

      await category.merge({
        name: payload.name ?? category.name,
        type: payload.type ?? category.type,
        description: payload.description ?? category.description,
        parent: payload.parent ?? category.parent,
        status: payload.status ?? category.status,
      }).save()

      response.json(category)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async destroy ({request, response}: HttpContextContract) {
    //
  }
}
