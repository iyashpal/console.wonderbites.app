import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core categories index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.categories.index'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.index'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.categories.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.index'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.categories.index')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.index'])

  test('it allows access to list the categories.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const categories = await CategoryFactory.createMany(5)

    const response = await client.get(route('core.categories.index')).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      data: categories.map(category => ({
        id: category.id,
        name: category.name,
      })),
      meta: {
        total: categories.length,
      },
    })
  }).tags(['@core', '@core.categories.index'])
})
