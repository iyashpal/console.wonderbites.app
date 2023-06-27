import {BannerBuilder} from 'App/Helpers/Database'
import ExceptionJSON from 'App/Helpers/ExceptionJSON'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BannersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const banners = await (new BannerBuilder(request))

        .resolve('banners').query()

      response.json(banners)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({request, params, response}: HttpContextContract) {
    try {
      const banner = await (new BannerBuilder(request))

        .resolve('banner').query().where('id', params.id).firstOrFail()

      response.json(banner)
    } catch (error) {
      response.status(error.status).json(new ExceptionJSON(error))
    }
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
