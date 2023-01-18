import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [core.auth]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it allows logged-in user to access the auth state.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.auth')).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({id: user.id})
  }).tags(['@core', '@core.auth'])

  test('it allows guest user to access the auth state', async ({client, route, assert}) => {
    const response = await client.get(route('core.auth'))

    response.assertStatus(200)

    assert.empty(response.body())
  }).tags(['@core', '@core.auth'])
})
