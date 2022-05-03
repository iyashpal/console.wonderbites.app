import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Api auth logout', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Only authenticated user can logout from a session', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.logout')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ revoked: true })
  })

  test('Un-authenticated user can\'t logout from a session', async ({ client, route }) => {
    const response = await client.post(route('api.logout'))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })
})
