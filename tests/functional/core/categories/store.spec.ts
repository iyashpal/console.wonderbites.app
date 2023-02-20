import { test } from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core categories store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.categories.store'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.store'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.categories.store')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.store'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.categories.store')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.store'])
})
