import {User} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import StoreValidator from 'App/Validators/Core/Users/StoreValidator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'

export default class UsersController {
  public async index ({response, request}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as { page: number, limit: number }
      const users = await User.query().preload('role').paginate(page, limit)
      response.ok(users)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({request, response}: HttpContextContract) {
    try {
      const payload = await request.validate(StoreValidator)

      const user = await User.create({
        firstName: payload.first_name,
        lastName: payload.last_name,
        mobile: payload.phone,
        email: payload.email,
        avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : null,
        password: payload.password,
      })

      response.ok(user)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({params,response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      response.ok({user})
    } catch(error) {
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async update ({}: HttpContextContract) {
  }

  public async destroy ({}: HttpContextContract) {
  }
}
