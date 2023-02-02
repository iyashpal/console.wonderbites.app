import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('Core products show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const response = await client.get(route('core.products.show', product))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.show'])

  test('it do not allow access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.show'])

  test('it allows access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.show'])

  test('it allows access to a management user.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ id: product.id })
  }).tags(['@core', '@core.products.show'])
})
