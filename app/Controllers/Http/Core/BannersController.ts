import {Banner} from 'App/Models'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import {Attachment} from '@ioc:Adonis/Addons/AttachmentLite'
import type {HttpContextContract} from '@ioc:Adonis/Core/HttpContext'
import StoreValidator from 'App/Validators/Core/Banners/StoreValidator'
import UpdateValidator from 'App/Validators/Core/Banners/UpdateValidator'

export default class BannersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const {page = 1, limit = 10} = request.all() as { page: number, limit: number }
      const banners = await Banner.query().orderBy('id', 'desc').paginate(page, limit)

      response.ok(banners)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async create ({}: HttpContextContract) {
  }

  public async store ({auth, request, response}: HttpContextContract) {
    try {
      const user = auth.use('api').user!
      const payload = await request.validate(StoreValidator)

      const banner = await Banner.create({
        userId: user.id,
        title: payload.title,
        status: payload.status,
        options: payload.options,
        attachment: Attachment.fromFile(request.file('attachment')!),
      })

      response.ok(banner)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async show ({params, response}: HttpContextContract) {
    try {
      const banner = await Banner.query().preload('user').where('id', params.id).firstOrFail()

      response.ok({banner})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async edit ({params, response}: HttpContextContract) {
    try {
      const banner = await Banner.query().where('id', params.id).firstOrFail()

      response.ok({banner})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async update ({request, params, response}: HttpContextContract) {
    try {
      const banner = await Banner.query().where('id', params.id).firstOrFail()
      const payload = await request.validate(UpdateValidator)

      await banner.merge({
        title: payload.title,
        status: payload.status,
        options: payload.options,
        attachment: payload.attachment ? Attachment.fromFile(request.file('attachment')!) : banner.attachment,
      })

      response.ok(banner)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async destroy ({params, response}: HttpContextContract) {
    try {
      const banner = await Banner.query().where('id', params.id).firstOrFail()
      await banner.delete()
      response.ok({success: true})
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }
}
