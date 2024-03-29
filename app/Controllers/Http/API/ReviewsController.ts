import { Review } from 'App/Models'
import CreateValidator from 'App/Validators/API/Review/CreateValidator'
import UpdateValidator from 'App/Validators/API/Review/UpdateValidator'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReviewsController {
  public async index ({ request, response }: HttpContextContract) {
    try {
      const reviews = await Review.query()
        .match([request.input('with', []).includes('review.user'), query => query.preload('user')])
        .match([
          request.input('with', []).includes('review.product'),
          query => query.preload('product', builder => builder.match([
            request.input('with', []).includes('review.product.media'),
            query => query.preload('media'),
          ])),
        ])
        .match([
          request.input('product', null),
          query => query.where('reviewable_id', request.input('product')).where('reviewable', 'Product'),
        ])
        .paginate(request.input('page', 1), request.input('limit', 10))

      response.json(reviews)
    } catch (error) {
      throw error
    }
  }

  public async store ({ request, auth, response }: HttpContextContract) {
    try {
      const user = auth.use('api').user

      const attributes = await request.validate(CreateValidator)

      const review = await user?.related('reviews').create(attributes)

      response.json(review)
    } catch (error) {
      throw error
    }
  }

  public async show ({ request, response, params }: HttpContextContract) {
    const review = await Review.query()
      .match([request.input('with', []).includes('review.user'), query => query.preload('user')])
      .match([
        request.input('with', []).includes('review.product'),
        query => query.preload('product', builder => builder.match([
          request.input('with', []).includes('review.product.media'),
          query => query.preload('media'),
        ])),
      ])
      .where('id', params.id)
      .first()

    response.json(review)
  }

  public async update ({ request, response, params }: HttpContextContract) {
    try {
      const attributes = await request.validate(UpdateValidator)

      const review = await Review.findOrFail(params.id)

      review.merge(attributes).save()

      response.json(review)
    } catch (error) {
      throw error
    }
  }
}
