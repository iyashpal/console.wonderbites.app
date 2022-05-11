import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('Api wishlist', (group) => {
  /**
   * Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: User cannot access the wishlist without login.
   * 
   * ✔ POST request hit to `route('api.wishlists.show')` without api guard and authentication.
   * ✔ Request status should be Unauthenticated(401).
   * ✔ Request response body should contain message field with value "Unauthenticated".
   */
  test('User cannot access the wishlist without login', async ({ client, route }) => {
    const response = await client.get(route('api.wishlists.show'))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * Case: User can access the wishlist after login.
   * 
   * ✔ Create a user.
   * ✔ Create 5 products having newly created user id.
   * ✔ POST request to `route('api.wishlists.show')` without api guard and authentication.
   * ✔ Request status should be Unauthenticated(401).
   * ✔ Request response body should contain message field with value "Unauthenticated".
   */
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

    const response = await client.get(route('api.wishlists.show')).guard('api').loginAs(user)

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      { products: products.map(({ id, name, sku, calories }) => ({ id, name, sku, calories })) }
    )
  })

  test('User can add product to his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.post(route('api.wishlists.update')).guard('api').loginAs(user)
      .json({ action: 'SYNC', products: { [product.id]: { qty: 3 } } })

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      {
        products: [
          { id: product.id, name: product.name, description: product.description }
        ],
      }
    )
  })

  test('User can remove product from his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.post(route('api.wishlists.update')).guard('api').loginAs(user)
      .json({ action: 'DETACH', products: [product.id] })

    response.assertStatus(200)

    assert.containsSubset(response.body(), { products: [] })
  })
})
