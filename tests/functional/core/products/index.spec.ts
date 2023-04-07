import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {ProductFactory, UserFactory} from 'Database/factories'

test.group('Core [products.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow guest user to list the products.', async ({client, route}) => {
    const response = await client.get(route('core.products.index'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products', '@core.products.index'])

  test('it do not allow none core user to list the products.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.products.index')).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products', '@core.products.index'])

  test('it allows a core user to list the products.', async ({client, route}) => {
    await ProductFactory.createMany(6)
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.products.index'))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({meta: {total: 6}})
  }).tags(['@core', '@core.products', '@core.products.index'])

  test('it do not list deleted products', async ({ client, route}) => {
    await ProductFactory.createMany(6)
    await ProductFactory.merge({deletedAt: DateTime.now()}).createMany(5)

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.products.index'))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({meta: { total: 6}})
  }).tags(['@core', '@core.products', '@core.products.index'])

  test('it allows user to switch between pages.', async ({client, route}) => {
    await ProductFactory.createMany(40)

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.products.index', [], {qs: {page: 2, limit: 20}}))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ meta: { total: 40, first_page: 1, last_page: 2, current_page: 2 }})
  }).tags(['@core', '@core.products', '@core.products.index'])
})
