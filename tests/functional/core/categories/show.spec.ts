import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core categories show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const category = await CategoryFactory.create()

    const response = await client.get(route('core.categories.show', category))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.show'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const category = await CategoryFactory.create()

    const user = await UserFactory.create()

    const response = await client.get(route('core.categories.show', category)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.show'])

  test('it allows access to a management user.', async ({client, route}) => {
    const category = await CategoryFactory.create()

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.categories.show', category)).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.show'])

  test('it sees the show category view data.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.categories.show', category)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      category: {id: category.id},
    })
  }).tags(['@core', '@core.categories.show'])
})
