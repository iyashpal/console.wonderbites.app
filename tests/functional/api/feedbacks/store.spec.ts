import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { FeedbackFactory, UserFactory } from 'Database/factories'

test.group('API [feedbacks.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it denies access to create', async ({ client, route }) => {
    const $response = await client.post(route('api.feedbacks.store')).json([])

    $response.assertStatus(401)
  }).tags(['@api', '@api.feedback', '@api.feedback.store'])

  test('it allows to create new feedback.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const feedback = await FeedbackFactory.make()

    const $response = await client.post(route('api.feedbacks.store'))
      .guard('api').loginAs(user).json(feedback.toJSON())

    $response.assertStatus(200)

    $response.assertBodyContains({
      user_id: user.id,
      body: feedback.body,
      source: feedback.source,
      experience: feedback.experience,
    })
  }).tags(['@api', '@api.feedback', '@api.feedback.store', 'feedback.testing'])

  test('it denies to create feedback if experience is missing.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const feedback = await FeedbackFactory.merge({ experience: '' }).make()

    const $response = await client.post(route('api.feedbacks.store'))
      .guard('api').loginAs(user).json(feedback.toJSON())

    $response.assertStatus(422)

    $response.assertBodyContains({ messages: { experience: ['Experience is required.'] } })
  }).tags(['@api', '@api.feedback', '@api.feedback.store'])

  test('it denies to create feedback if body is missing.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const feedback = await FeedbackFactory.merge({ body: '' }).make()

    const $response = await client.post(route('api.feedbacks.store'))
      .guard('api').loginAs(user).json(feedback.toJSON())

    $response.assertStatus(422)

    $response.assertBodyContains({ messages: { body: ['Body is required.'] } })
  }).tags(['@api', '@api.feedback', '@api.feedback.store'])

  test('it denies to create feedback if source is missing.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const feedback = await FeedbackFactory.merge({ source: '' }).with('user').make()

    const $response = await client.post(route('api.feedbacks.store'))
      .guard('api').loginAs(user).json(feedback.toJSON())

    $response.assertStatus(422)

    $response.assertBodyContains({ messages: { source: ['Source is required.'] } })
  }).tags(['@api', '@api.feedback', '@api.feedback.store'])
})
