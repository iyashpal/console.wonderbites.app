import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('Core [products.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const response = await client.delete(route('core.products.destroy', product))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.destroy'])

  test('it do not allow access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.delete(route('core.products.destroy', product)).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.destroy'])

  test('it allows to deletion of a product to a management user.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.delete(route('core.products.destroy', product)).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.products.destroy'])
})
