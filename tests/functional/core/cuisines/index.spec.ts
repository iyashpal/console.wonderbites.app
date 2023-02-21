import {DateTime} from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CuisineFactory, UserFactory} from 'Database/factories'

test.group('Core cuisines index', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.cuisines.index'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.index'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.cuisines.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.index'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.cuisines.index')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.cuisines.index'])

  test('it reads paginated list of cuisines - page: {$i}')
    .with([1, 2])
    .run(async ({client, route}, page) => {
      const user = await UserFactory.with('role').create()
      const cuisines = await CuisineFactory.createMany(20)

      const response = await client.get(route('core.cuisines.index', {}, {qs: {page}})).guard('api').loginAs(user)

      response.assertStatus(200)

      response.assertBodyContains({
        meta: {total: 20, current_page: page, last_page: 2, first_page: 1},
        data: cuisines
          .filter((cuisine, index) => (page === 1 ? index < 10 : index >= 10))
          .map(cuisine => ({id: cuisine.id, name: cuisine.name})),
      })
    }).tags(['@core', '@core.cuisines.index'])

  test('it do not list deleted cuisines', async ({client, route}) => {
    await CuisineFactory.createMany(6)
    await CuisineFactory.merge({deletedAt: DateTime.now()}).createMany(4)

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.cuisines.index'))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({meta: {total: 6}})
  }).tags(['@core', '@core.cuisines.index'])
})
