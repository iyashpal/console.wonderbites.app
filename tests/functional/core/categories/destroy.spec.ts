import { test } from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core categories destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.categories.destroy'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.destroy'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.categories.destroy')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.destroy'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.categories.destroy')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.destroy'])
})
