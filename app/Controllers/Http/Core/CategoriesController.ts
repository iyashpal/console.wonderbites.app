import {Category} from 'App/Models'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Categories/StoreValidator'

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

  public async create ({request, response}: HttpContextContract) {
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

  public async update ({request, response, params}: HttpContextContract) {
    //
  }

  public async destroy ({request, response}: HttpContextContract) {
    //
  }
}
