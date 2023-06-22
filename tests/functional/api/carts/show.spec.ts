import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [carts.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It allows guest users to access the cart', async ({ client, route, assert }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It allows authenticated user to access the cart also.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.get(route('api.carts.show')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('it allows users to access the cart by it\'s id', async ({ client, route, assert }) => {
    const user = await UserFactory.with('cart').create()

    const response = await client.get(route('api.carts.show')).guard('api').loginAs(user)
    response.assertStatus(200)
    assert.equal(user.cart.id, response.body().id)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if the cart id in header is unavailable.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('cart', 1, query => query.merge({status: 0})).create()

    const response = await client.get(route('api.carts.show'))
      .header('X-Cart-ID', user.cart.id.toString())
      .guard('api').loginAs(user)
    assert.notEqual(response.body()?.id, user.cart.id)
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if the cart token in header is missing and user is guest.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()

      const response = await client.get(route('api.carts.show'))
        .header('X-Cart-ID', cart.id.toString())
      assert.notEqual(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if the cart id in header is missing and user is guest.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()

      const response = await client.get(route('api.carts.show'))
        .header('X-Cart-Token', cart.token)
      assert.notEqual(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It do not generate a new cart if the cart token and id in header is not missing and user is guest.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()

      const response = await client.get(route('api.carts.show'))
        .headers({
          'X-Cart-ID': cart.id.toString(),
          'X-Cart-Token': cart.token,
        })
      assert.equal(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])
})
