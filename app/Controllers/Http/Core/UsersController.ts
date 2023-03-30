import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import {User} from 'App/Models'

export default class UsersController {
  public async index ({response, request}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as { page: number, limit: number }
      const users = await User.query().paginate(page, limit)
      response.ok(users)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({}: HttpContextContract) {
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({}: HttpContextContract) {
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
