import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, ReviewFactory, UserFactory } from 'Database/factories'

test.group('Api [reviews.store]', (group) => {
  group.each.setup(async function () {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow un-authenticated user to create a review', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const review = await ReviewFactory.merge({ typeId: product.id }).make()

    const request = await client.post(route('api.reviews.store')).json(review.toObject())

    request.assertStatus(401)
    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@reviews', '@reviews.store'])

  test('it can allow logged in user to create a review.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const review = await ReviewFactory.merge({ typeId: product.id }).make()

    const request = await client.post(route('api.reviews.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(review.toObject())

    request.assertStatus(200)

    request.assertBodyContains({
      user_id: user.id,
      title: review.title,
      body: review.body,
      rating: review.rating,
    })
  }).tags(['@reviews', '@reviews.store'])

  test('it can validate the type id before submitting the review.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const review = await ReviewFactory.make()

    const request = await client.post(route('api.reviews.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(review.toObject())

    request.assertStatus(422)

    request.assertBodyContains({ messages: { typeId: ['Type ID field is required.'] } })
  }).tags(['@reviews', '@reviews.store'])

  test('it can validate the review title before submitting the review.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const review = await ReviewFactory.merge({ typeId: product.id, title: '' }).make()

    const request = await client.post(route('api.reviews.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(review.toObject())

    request.assertStatus(422)

    request.assertBodyContains({ messages: { title: ['Title is required.'] } })
  }).tags(['@reviews', '@reviews.store'])

  test('it can validate the review body before submitting the review.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const review = await ReviewFactory.merge({ typeId: product.id, body: '' }).make()

    const request = await client.post(route('api.reviews.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(review.toObject())

    request.assertStatus(422)

    request.assertBodyContains({ messages: { body: ['Body is required.'] } })
  }).tags(['@reviews', '@reviews.store'])

  test('it can validate the review rating before submitting the review.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const review = await ReviewFactory.merge({ typeId: product.id, body: '' }).make()

    const request = await client.post(route('api.reviews.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(review.toObject())

    request.assertStatus(422)

    request.assertBodyContains({ messages: { rating: ['Rating field is required.'] } })
  }).tags(['@reviews', '@reviews.store'])
})