import {User} from 'App/Models'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import StoreValidator from 'App/Validators/Core/Users/StoreValidator'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import UpdateValidator from 'App/Validators/Core/Users/UpdateValidator'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'

export default class UsersController {
  public async index ({response, request}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as { page: number, limit: number }
      const users = await User.query().preload('role').paginate(page, limit)
      response.ok(users)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
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
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async show ({}: HttpContextContract) {
  }

  public async edit ({params, response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      response.ok({user})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async update ({params, request, response}: HttpContextContract) {
    try {
      const user = await User.findOrFail(params.id)

      const payload = await request.validate(UpdateValidator)

      await user.merge({
        firstName: payload.first_name,
        lastName: payload.last_name,
        mobile: payload.phone,
        email: payload.email,
        avatar: payload.avatar ? Attachment.fromFile(request.file('avatar')!) : user.avatar,
        ...(payload.password ? {password: payload.password} : {}),
      }).save()

      response.ok(user)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async destroy ({auth, params, response}: HttpContextContract) {
    try {
      const authUser = auth.use('api').user!
      const user = await User.findOrFail(params.id)

      if (authUser.id !== user.id) {
        await user.delete()
        return response.ok({success: true})
      }

      response.unauthorized({message: 'You can not delete your own account.'})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
