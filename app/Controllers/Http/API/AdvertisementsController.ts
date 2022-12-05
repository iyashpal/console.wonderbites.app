import { Advertisement } from 'App/Models'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdvertisementsController {
  public async index ({ response }: HttpContextContract) {
    const advertisements = await Advertisement.all()

    response.json(advertisements)
  }

  public async show ({ params, response }: HttpContextContract) {
    const advertisement = await Advertisement.query().where('id', params.id)

    response.json(advertisement)
  }
}
