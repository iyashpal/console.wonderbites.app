import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'

test.group('API [users.avatar]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow un-authenticated users to update the account avatar.', async ({ client, route }) => {
    const $response = await client.put(route('api.users.avatar'))

    $response.assertStatus(401)

    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.users', '@api.users.avatar'])

  test('it can allow users to remove their avatar.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.avatar'))
      .guard('api').loginAs(user).json({})

    $response.assertStatus(200)

    $response.assertBodyContains({ avatar: null })
  }).tags(['@api', '@api.users', '@api.users.avatar'])

  test('it can allow users to add/update avatar to their profile.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.avatar'))
      .guard('api').loginAs(user).file('avatar', Application.publicPath('/images/logo.svg'))

    $response.assertStatus(200)

    $response.assertBodyContains({ avatar: { extname: 'svg', mimeType: 'image/svg' } })
  }).tags(['@api', '@api.users', '@api.users.avatar'])
})
