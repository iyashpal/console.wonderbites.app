import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('API [wishlists.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User cannot access the wishlist without login', async ({ client, route }) => {
    const response = await client.get(route('api.wishlists.show'))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@wishlists', '@wishlists.show'])

  test('User can access the wishlist after login', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.merge([
      { user_id: user.id },
      { user_id: user.id },
      { user_id: user.id },
      { user_id: user.id },
      { user_id: user.id },
    ]).createMany(5)

    const wishlist = await WishlistFactory.merge({ user_id: user.id }).create()

    wishlist.related('products').attach(products.map(({ id }) => id))
    const qs = {with: ['wishlist.products']}
    const response = await client.get(route('api.wishlists.show', {}, {qs}))

      .guard('api').loginAs(user)

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      { products: products.map(({ id, name, sku, calories }) => ({ id, name, sku, calories })) }
    )
  }).tags(['@wishlists', '@wishlists.show'])
})
