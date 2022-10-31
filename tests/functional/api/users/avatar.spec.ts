import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [users.avatar]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow un-authenticated users to update the account avatar.', async ({ client, route }) => {
    const $response = await client.put(route('api.users.avatar'))

    $response.assertStatus(401)

    $response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@users', '@users.avatar'])

  test('it can not allow users to remove avatar', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.avatar'))
      .guard('api').loginAs(user).json({ action: 'REMOVE' })

    $response.assertStatus(200)

    $response.assertBodyContains({ image_path: null })
  })
})
