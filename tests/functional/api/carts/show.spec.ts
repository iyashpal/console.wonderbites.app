import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, UserFactory } from 'Database/factories'

test.group('API [carts.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('Authenticated user can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('Only active carts are accessible.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const cart = await CartFactory.merge({ userId: user.id, status: 0 }).create()

    const response = await client.get(route('api.carts.show'))
      .guard('api').loginAs(user)

    assert.notEqual(response.body()?.id, cart.id)
  }).tags(['@api', '@api.carts', '@api.carts.show'])
})
