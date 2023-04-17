import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('API [wishlists.update]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User can add product to his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const qs = { with: ['wishlist.products'] }

    const response = await client.put(route('api.wishlists.update', {}, {qs})).guard('api')

      .loginAs(user)

      .json({ action: 'ADD', products: { [product.id]: { qty: 3 } } })

    response.assertStatus(200)

    assert.containsSubset(
      response.body(),
      {
        products: [
          { id: product.id, name: product.name, description: product.description },
        ],
      }
    )
  }).tags(['@api', '@api.wishlists', '@api.wishlists.update'])

  test('User can remove product from his wishlist', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()
    const qs = { with: ['wishlist.products'] }
    const response = await client.put(route('api.wishlists.update', {}, {qs})).guard('api')

      .loginAs(user)

      .json({ action: 'REMOVE', products: [product.id] })

    response.assertStatus(200)

    assert.containsSubset(response.body(), { products: [] })
  }).tags(['@api', '@api.wishlists', '@api.wishlists.update'])

  test('User can increase the wishlist product quantity.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach({ [product.id]: { qty: 4 } })
    const qs = { with: ['wishlist.products'] }
    const response = await client.put(route('api.wishlists.update', {}, {qs})).guard('api')

      .loginAs(user)

      .json({ action: 'ADD', products: { [product.id]: { qty: 4 } } })

    response.assertStatus(200)

    response.assertBodyContains({
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 4,
            pivot_product_id: product.id,
          },
        },
      ],
    })
  }).tags(['@api', '@api.wishlists', '@api.wishlists.update'])

  test('User can decrease the wishlist product quantity.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()
    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach({ [product.id]: { qty: 4 } })

    const qs = { with: ['wishlist.products'] }
    const response = await client.put(route('api.wishlists.update', {}, {qs})).guard('api')

      .loginAs(user)

      .json({ action: 'ADD', products: { [product.id]: { qty: 3 } } })

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
  }).tags(['@api', '@api.wishlists', '@api.wishlists.update'])
})
