import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core [categories.create]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.categories.create'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.create'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.categories.create')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.create'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.categories.create')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.create'])

  test('it sees the create category page data.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const categories = await CategoryFactory.createMany(6)
    const response = await client.get(route('core.categories.create')).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      categories: categories.map(category => ({id: category.id})),
    })
  }).tags(['@core', '@core.categories.create'])
})
