import {DateTime} from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CuisineFactory, UserFactory} from 'Database/factories'

test.group('Core [cuisines.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()

    const response = await client.get(route('core.cuisines.show', cuisine))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.cuisines.show'])

  test('it do not allow access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cuisine = await CuisineFactory.create()

    const response = await client.get(route('core.cuisines.show', cuisine)).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.cuisines.show'])

  test('it throws 404 error if the cuisine is trashed.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.merge({deletedAt: DateTime.now()}).create()

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.cuisines.show', cuisine)).guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.show'])

  test('it throws 404 error if the cuisine does not exists.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.cuisines.show', {id: 50})).guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.show'])

  test('it allows access to a management user.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.cuisines.show', cuisine)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ id: cuisine.id })
  }).tags(['@core', '@core.cuisines.show'])

  test('it can preload the cuisine creator.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()
    const cuisine = await CuisineFactory.merge({userId: user.id}).create()

    const response = await client.get(route('core.cuisines.show', cuisine, {qs: {with: ['cuisines.user']}}))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ id: cuisine.id, user: {id : user.id} })
  }).tags(['@core', '@core.cuisines.show'])
})
