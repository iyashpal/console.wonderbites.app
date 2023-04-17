import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [wishlists.clean]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow access to un-authenticated users.', async ({ client, route }) => {
    const $response = await client.post(route('api.wishlists.clean'))

    $response.assertStatus(401)

    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.wishlists', '@api.wishlists.clean'])

  test('it can allow access to clean the user wishlist.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('wishlist', 1, query => query.with('products', 5)).create()
    const qs = {with: ['wishlist.products', 'wishlist.ingredients']}
    const $response = await client.post(route('api.wishlists.clean', {}, { qs }))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    const { products, ingredients } = $response.body()

    assert.equal(products?.length, 0)
    assert.equal(ingredients?.length, 0)

    $response.assertBodyContains({ id: user.wishlist.id, products: [], ingredients: [] })
  }).tags(['@api', '@api.wishlists', '@api.wishlists.clean'])
})
