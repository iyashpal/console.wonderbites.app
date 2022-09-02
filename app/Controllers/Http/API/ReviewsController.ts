import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Review } from 'App/Models'

export default class ReviewsController {
  public async index ({ request, response }: HttpContextContract) {
    const reviews = await Review.query()
      .match([request.input('with', []).includes('review.user'), query => query.preload('user')])
      .match([request.input('with', []).includes('review.product'), query => query.preload('product')])
      .match([
        request.input('product', null),
        query => query.where('type_id', request.input('product')).where('type', 'Product'),
      ])
      .paginate(request.input('page', 1), request.input('limit', 10))

    response.json(reviews)
  }

  public async create ({ }: HttpContextContract) {
  }

  public async store ({ }: HttpContextContract) {
  }

  public async show ({ }: HttpContextContract) {
  }

  public async edit ({ }: HttpContextContract) {
  }

  public async update ({ }: HttpContextContract) {
  }

  public async destroy ({ }: HttpContextContract) {
  }
}
