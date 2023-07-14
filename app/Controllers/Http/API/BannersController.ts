import { builder } from 'App/Helpers/Database'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BannersController {
  public async index ({request, response}: HttpContextContract) {
    try {
      const banners = await builder('Banner', request, 'banners').query()

      response.json(banners)
    } catch (error) {
      throw error
    }
  }

  public async show ({request, params, response}: HttpContextContract) {
    try {
      const banner = await builder('Banner', request, 'banner').query()
        .where('id', params.id).firstOrFail()

      response.json(banner)
    } catch (error) {
      throw error
    }
  }
}
