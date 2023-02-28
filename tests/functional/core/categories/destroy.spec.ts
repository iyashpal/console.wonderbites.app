import {DateTime} from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core categories destroy', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code to a guest user.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const response = await client.delete(route('core.categories.destroy', category))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.destroy'])

  test('it throws 401 error code to a none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const category = await CategoryFactory.create()
    const response = await client.delete(route('core.categories.destroy', category)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.destroy'])

  test('it throws 200 status code to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.delete(route('core.categories.destroy', category))
      .guard('api').loginAs(user)
    response.assertStatus(200)
  }).tags(['@core', '@core.categories.destroy'])

  test('it throws 404 error if the category is trashed.', async ({client, route}) => {
    const category = await CategoryFactory.merge({deletedAt: DateTime.now()}).create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.categories.destroy', category))
      .guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.categories.destroy'])

  test('it throws 404 error if the category does not exists.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.categories.destroy', {id: 50}))
      .guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.categories.destroy'])

  test('it soft deletes the category.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.categories.destroy', category))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({deleted: true})
  }).tags(['@core', '@core.categories.destroy'])

  test('it deletes the category permanently.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.categories.destroy', category, {qs: {force: 1}}))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({deleted: true})
  }).tags(['@core', '@core.categories.destroy'])
})
