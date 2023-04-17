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
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.wishlists', '@api.wishlists.show'])

  test('User can access the wishlist after login', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.merge([
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
    ]).createMany(5)

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    wishlist.related('products').attach(products.map(({ id }) => id))
    const qs = {with: ['wishlist.products']}
    const response = await client.get(route('api.wishlists.show', {}, {qs}))

      .guard('api').loginAs(user)

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      { products: products.map(({ id, name, sku, calories }) => ({ id, name, sku, calories })) }
    )
  }).tags(['@api', '@api.wishlists', '@api.wishlists.show'])
})
