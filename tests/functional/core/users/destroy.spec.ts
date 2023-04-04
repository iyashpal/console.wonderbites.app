import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [users.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it reads 401 status code when the access token is missing.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.delete(route('core.users.destroy', user))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.destroy'])

  test('it reads 401 status code when user login with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.delete(route('core.users.destroy', user)).guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.destroy'])

  test('it reads 401 status code when user user login try to delete his own account.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.delete(route('core.users.destroy', user)).guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({message: 'You can not delete your own account.'})
  }).tags(['@core', '@core.users.destroy'])

  test('it reads 200 status code and remove the user from database.', async ({client, route}) => {
    const subscriber = await UserFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.delete(route('core.users.destroy', subscriber)).guard('api').loginAs(user)
    response.assertStatus(200)
    response.assertBodyContains({success: true})
  }).tags(['@core', '@core.users.destroy'])
})
