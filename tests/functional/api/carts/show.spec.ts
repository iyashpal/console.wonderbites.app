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

  test('It allows guest users to access the cart.', async ({ client, route, assert }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
    assert.properties(response.body(), ['id', 'token'])
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It allows logged-in users to access their cart.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('cart').create()
    const response = await client.get(route('api.carts.show', user.cart)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ id: user.cart.id, token: user.cart.token })
  }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('it allows logged-in users to access their cart without id and token.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.with('cart').create()

      const response = await client.get(route('api.carts.show')).guard('api').loginAs(user)
      response.assertStatus(200)
      assert.equal(user.cart.id, response.body().id)
      response.assertBodyContains({ id: user.cart.id, token: user.cart.token })
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It do not check for id and token params if {$self} is missing and user is logged-in.')
    .with(['id', 'token'])
    .run(async ({ client, route, assert }, param) => {
      const user = await UserFactory.with('cart').create()
      const response = await client.get(route('api.carts.show', {[param]: user.cart[param]}))
        .guard('api').loginAs(user)

      response.assertStatus(200)
      assert.equal(response.body().id, user.cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if id and token params are not a correct pair and user is logged-in.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()
      const user = await UserFactory.with('cart').create()
      const params = {id: user.cart.id, token: cart.token}
      const response = await client.get(route('api.carts.show', params))
        .guard('api').loginAs(user)

      response.assertStatus(200)
      assert.notEqual(response.body().id, user.cart.id)
      assert.notEqual(response.body().token, cart.token)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if the cart {$self} param is missing and user is guest.')
    .with(['id', 'token'])
    .run(async ({ client, route, assert }, param) => {
      const cart = await CartFactory.create()
      const response = await client.get(route('api.carts.show', { [param]: cart[param] }))

      response.assertStatus(200)
      assert.notEqual(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It generates a new cart if id and token params are not a correct pair and user is guest.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()
      const user = await UserFactory.with('cart').create()
      const response = await client.get(route('api.carts.show', { id: user.cart.id, token: cart.token }))

      response.assertStatus(200)
      assert.notEqual(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])

  test('It do not generate a new cart if token and id params are the valid pair of cart and user is guest.')
    .run(async ({ client, route, assert }) => {
      const cart = await CartFactory.create()

      const response = await client.get(route('api.carts.show', cart))
      assert.equal(response.body().id, cart.id)
    }).tags(['@api', '@api.carts', '@api.carts.show'])
})
