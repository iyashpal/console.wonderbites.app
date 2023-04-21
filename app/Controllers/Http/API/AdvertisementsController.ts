import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import AdvertisementQuery from 'App/Services/Database/AdvertisementQuery'

export default class AdvertisementsController {
  public async index ({ request, response }: HttpContextContract) {
    const advertisements = await (new AdvertisementQuery(request))

      .resolveQueryWithPrefix('advertisements')

      .query()

    response.json(advertisements)
  }

  public async show ({request, params, response }: HttpContextContract) {
    const advertisement = await (new AdvertisementQuery(request))

      .resolveQueryWithPrefix('advertisement')

      .query().where('id', params.id).firstOrFail()

    response.json(advertisement)
  }
}
