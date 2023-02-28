import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core [categories.edit]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const response = await client.get(route('core.categories.edit', category))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.edit'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const category = await CategoryFactory.create()
    const response = await client.get(route('core.categories.edit', category)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.edit'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.get(route('core.categories.edit', category)).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.edit'])

  test('it sees the edit category view data.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()
    const categories = await CategoryFactory.createMany(6)
    const response = await client.get(route('core.categories.edit', category)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      category: {id: category.id},
      categories: categories.map(category => ({id: category.id})),
    })
  }).tags(['@core', '@core.categories.edit'])
})
