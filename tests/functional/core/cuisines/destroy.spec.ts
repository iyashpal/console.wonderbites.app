import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CuisineFactory, UserFactory} from 'Database/factories'

test.group('Core [cuisines.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code to a guest user.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const response = await client.delete(route('core.cuisines.destroy', cuisine))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it throws 401 error code to a user who has no role assigned.', async ({client, route}) => {
    const user = await UserFactory.create()
    const cuisine = await CuisineFactory.create()

    const response = await client.delete(route('core.cuisines.destroy', cuisine)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it do not throw any 401 error code to a user who has a role assigned.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.cuisines.destroy', cuisine))
      .guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it throws 404 error if the cuisine is trashed.', async ({client, route}) => {
    const cuisine = await CuisineFactory.merge({deletedAt: DateTime.now()}).create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.cuisines.destroy', cuisine))
      .guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it throws 404 error if the cuisine does not exists.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.cuisines.destroy', {id: 50}))
      .guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it soft deletes the cuisine.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.cuisines.destroy', cuisine))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({deleted: true})
  }).tags(['@core', '@core.cuisines.destroy'])

  test('it deletes the cuisine permanently.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.cuisines.destroy', cuisine, {qs: {force: 1}}))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({deleted: true})
  }).tags(['@core', '@core.cuisines.destroy'])
})
