import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('Api wishlist', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * ✔ Access wishlist api without authentication.
   * ✔ Request status should be Unauthenticated(401).
   * ✔ Request response body should contain message field with value "Unauthenticated".
   */
  test('User cannot access the wishlist without login', async ({ client, route }) => {
    const response = await client.get(route('api.wishlists.show'))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need 5 or more products which is added to user's wishlist.
   * ✔ Access wishlist api with authentication.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain all wishlist products data.
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

    const response = await client.get(route('api.wishlists.show'))

      // @ts-ignore
      .guard('api').loginAs(user)

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      { products: products.map(({ id, name, sku, calories }) => ({ id, name, sku, calories })) }
    )
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need at least one product to add to wishlist.
   * ✔ Post product data to add to wishlist.
   * ✔ Request status needs to be OK(200).
   * ✔ Request response body should have the newly added product data along with the product quantity.
   */
  test('User can add product to his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.put(route('api.wishlists.update')).guard('api')

      // @ts-ignore
      .loginAs(user)

      .json({ action: 'SYNC', products: { [product.id]: { qty: 3 } } })

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      {
        products: [
          { id: product.id, name: product.name, description: product.description },
        ],
      }
    )
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need at least one product in wishlist which we will remove.
   * ✔ Post product data to remove from wishlist.
   * ✔ Request status needs to be OK(200).
   * ✔ Request response body shouldn't have the removed product data.
   */
  test('User can remove product from his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.put(route('api.wishlists.update')).guard('api')

      // @ts-ignore
      .loginAs(user)

      .json({ action: 'DETACH', products: [product.id] })

    response.assertStatus(200)

    assert.containsSubset(response.body(), { products: [] })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need at least one product in the wishlist which we will use to increase the quantity.
   * ✔ Post product data with increased quantity.
   * ✔ Request status needs to be OK(200).
   * ✔ Request response body should have the product data as well as the increased quantity.
   */
  test('User can increase the wishlist product quantity.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach({ [product.id]: { qty: 4 } })

    const response = await client.put(route('api.wishlists.update')).guard('api')

      // @ts-ignore
      .loginAs(user)

      .json({ action: 'SYNC', products: { [product.id]: { qty: 5 } } })

    response.assertStatus(200)

    response.assertBodyContains({
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 5,
            pivot_product_id: product.id,
          },
        },
      ],
    })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need at least one product in the wishlist which we will use to decrease the quantity.
   * ✔ Post product data with decreased quantity.
   * ✔ Request status needs to be OK(200).
   * ✔ Request response body should have the product data as well as the decreased quantity.
   */
  test('User can increase the wishlist product quantity.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach({ [product.id]: { qty: 4 } })

    const response = await client.put(route('api.wishlists.update')).guard('api')

      // @ts-ignore
      .loginAs(user)

      .json({ action: 'SYNC', products: { [product.id]: { qty: 3 } } })

    response.assertStatus(200)

    response.assertBodyContains({
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 3,
            pivot_product_id: product.id,
          },
        },
      ],
    })
  })
})
