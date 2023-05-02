import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, UserFactory } from 'Database/factories'

test.group('Core [actions.categories.extras]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is not logged in.', async ({ client, route }) => {
    const category = await CategoryFactory.create()
    const params = { id: category.id }
    const response = await client.post(route('core.actions.categories.extras', params))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.actions.categories.extras'])

  test('it reads 401 status code when user is logged with a invalid role.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const category = await CategoryFactory.create()
    const params = { id: category.id }
    const response = await client.post(route('core.actions.categories.extras', params))
      .guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.actions.categories.extras'])

  test('it reads 200 status code when user is logged in with a valid role.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()
    const category = await CategoryFactory.create()
    const params = { id: category.id }
    const response = await client.post(route('core.actions.categories.extras', params))
      .guard('api').loginAs(user).json({})

    response.assertStatus(200)
  }).tags(['@core', '@core.actions.categories.extras'])
})
