import {test} from '@japa/runner'
import {OrderFactory, UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [orders.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const response = await client.get(route('core.orders.index'))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.orders.index'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.orders.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.orders.index'])

  test('it reads 200 status code when user is authenticated with valid role.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.orders.index')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      data: [],
      meta: {current_page: 1},
    })
  }).tags(['@core', '@core.orders.index'])

  test('it reads orders in response.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const orders = await OrderFactory.with('user').createMany(10)
    const response = await client.get(route('core.orders.index')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      data: orders.map(({id}) => ({id})),
      meta: {current_page: 1},
    })
  }).tags(['@core', '@core.orders.index'])

  test('it can access page no. {$i}.')
    .with([1, 2, 3, 4])
    .run(async ({client, route}, i) => {
      const user = await UserFactory.with('role').create()
      await OrderFactory.with('user').createMany(40)
      const response = await client.get(route('core.orders.index', {}, {qs: {page: i}})).guard('api').loginAs(user)
      response.assertStatus(200)
      response.assertBodyContains({
        meta: {current_page: i, total: 40, last_page: 4, first_page: 1, per_page: 10},
      })
    })
    .tags(['@core', '@core.orders.index'])
})
