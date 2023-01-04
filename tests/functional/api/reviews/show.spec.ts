import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ProductFactory, ReviewFactory } from 'Database/factories'

test.group('API [reviews.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can access the review details.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const review = await ReviewFactory.with('user').merge({ reviewableId: product.id }).create()

    const request = await client.get(route('api.reviews.show', review))

    request.assertStatus(200)

    request.assertBodyContains({
      id: review.id,
      title: review.title,
      body: review.body,
      reviewable_id: product.id,
    })
  }).tags(['@reviews', '@reviews.show'])

  test('it can access the review user details.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const review = await ReviewFactory.with('user').merge({ reviewableId: product.id }).create()

    const request = await client.get(route('api.reviews.show', review, { qs: { with: ['review.user'] } }))

    request.assertStatus(200)

    request.assertBodyContains({
      id: review.id,
      title: review.title,
      body: review.body,
      user_id: review.userId,
      reviewable_id: product.id,
      user: {
        id: review.user.id,
      },
    })
  }).tags(['@reviews', '@reviews.show'])

  test('it can access the review product details.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const review = await ReviewFactory.with('user').merge({ reviewableId: product.id }).create()

    const request = await client.get(route('api.reviews.show', review, { qs: { with: ['review.product'] } }))

    request.assertStatus(200)

    request.assertBodyContains({
      id: review.id,
      title: review.title,
      body: review.body,
      user_id: review.userId,
      reviewable_id: product.id,
      product: {
        id: product.id,
      },
    })
  }).tags(['@reviews', '@reviews.show'])

  test('it can access the review product details with images.', async ({ client, route }) => {
    const product = await ProductFactory.with('media', 3).create()

    const review = await ReviewFactory.with('user').merge({ reviewableId: product.id }).create()

    const qs = { with: ['review.product', 'review.product.media'] }

    const request = await client.get(route('api.reviews.show', review, { qs }))

    request.assertStatus(200)

    request.assertBodyContains({
      id: review.id,
      title: review.title,
      body: review.body,
      user_id: review.userId,
      reviewable_id: product.id,
      product: {
        id: product.id,
        media: product.media.map(({ id }) => ({ id })),
      },
    })
  }).tags(['@reviews', '@reviews.show'])

  test('it can access the review user and product details with images.', async ({ client, route }) => {
    const product = await ProductFactory.with('media', 3).create()

    const review = await ReviewFactory.with('user').merge({ reviewableId: product.id }).create()

    const qs = { with: ['review.user', 'review.product', 'review.product.media'] }

    const request = await client.get(route('api.reviews.show', review, { qs }))

    request.assertStatus(200)

    request.assertBodyContains({
      id: review.id,
      title: review.title,
      body: review.body,
      user_id: review.userId,
      user: {
        id: review.user.id,
      },
      reviewable_id: product.id,
      product: {
        id: product.id,
        media: product.media.map(({ id }) => ({ id })),
      },
    })
  }).tags(['@reviews', '@reviews.show'])
})
