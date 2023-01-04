import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { NotificationFactory, UserFactory } from 'Database/factories'

test.group('API [notifications.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow access to un-authenticated users.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const notification = await NotificationFactory.merge({ notifiable_id: user.id }).create()

    const $response = await client.put(route('api.notifications.update', notification))

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@notifications', '@notifications.update'])

  test('it can allow access to authenticated users.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const notification = await NotificationFactory.merge({ notifiable_id: user.id }).create()

    const $response = await client.put(route('api.notifications.update', notification))
      .guard('api').loginAs(user).json({ action: 'unread' })

    $response.assertStatus(200)
  }).tags(['@notifications', '@notifications.update'])

  test('it can mark the notification as read.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const notification = await NotificationFactory.merge({ notifiable_id: user.id }).create()

    const $response = await client.put(route('api.notifications.update', notification))
      .guard('api').loginAs(user).json({ action: 'read' })

    $response.assertStatus(200)

    assert.notEmpty($response.body().read_at)

    $response.assertBodyContains({ id: notification.id })
  }).tags(['@notifications', '@notifications.update'])

  test('it can mark the notification as unread.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const notification = await NotificationFactory.merge({ notifiable_id: user.id }).create()

    const $response = await client.put(route('api.notifications.update', notification))
      .guard('api').loginAs(user).json({ action: 'unread' })

    $response.assertStatus(200)
    assert.isNull($response.body().read_at)
    $response.assertBodyContains({ id: notification.id })
  }).tags(['@notifications', '@notifications.update'])
})
