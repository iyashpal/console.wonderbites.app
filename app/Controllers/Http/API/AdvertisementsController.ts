import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class AdvertisementsController {
  public async index ({ }: HttpContextContract) {
    console.log('this is advertisements listing page.')
  }

  public async create ({}: HttpContextContract) {}

  public async store ({}: HttpContextContract) {}

  public async show ({}: HttpContextContract) {}

  public async edit ({}: HttpContextContract) {}

  public async update ({}: HttpContextContract) {}

  public async destroy ({}: HttpContextContract) {}
}
