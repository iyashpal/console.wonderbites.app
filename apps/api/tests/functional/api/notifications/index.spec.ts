import { test } from '@japa/runner'
import { NotificationFactory, UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [notifications.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow access to un-authenticated users.', async ({ client, route }) => {
    const $response = await client.get(route('api.notifications.index'))

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@notifications', '@notifications.index', '@notifications.index'])

  test('it can allow access to authenticated users.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.get(route('api.notifications.index'))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({})
  }).tags(['@notifications', '@notifications.index.debug'])

  test('it can access user notifications.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const notification = await NotificationFactory.merge({ notifiableId: user.id }).create()

    const $response = await client.get(route('api.notifications.index'))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      meta: { total: 1 },
      data: [{ id: notification.id }],
    })
  }).tags(['@notifications', '@notifications.index'])
})
