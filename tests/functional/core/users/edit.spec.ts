import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [users.edit]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when the access token is missing.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.users.edit', {id: user.id}))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.edit'])

  test('it reads 401 status code when user login with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.users.edit', {id: user.id})).guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.edit'])

  test('it reads 200 status code when user login with valid role.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.users.edit', {id: user.id})).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.users.edit'])

  test('it reads user data in response.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.users.edit', {id: user.id})).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      user: {
        id: user.id,
        first_name: user.firstName,
        last_name: user.lastName,
      },
    })
  }).tags(['@core', '@core.users.edit'])
})
