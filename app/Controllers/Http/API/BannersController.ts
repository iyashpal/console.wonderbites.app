import {BannerBuilder} from 'App/Helpers/Database'
import ExceptionResponse from 'App/Helpers/ExceptionResponse'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BannersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const banners = await (new BannerBuilder(request))

        .resolve('banners').query()

      response.json(banners)
    } catch (error) {
      ExceptionResponse.use(error).resolve(response)
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
      ExceptionResponse.use(error).resolve(response)
    }
  }

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
