import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('Api cart', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * ✔ Request the cart with without login.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain empty products and ingridients arrays.
   */
  test('Guest users can access the cart', async ({ client, route, assert }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
    assert.equal(response.body()?.products.length, 0)
    assert.equal(response.body()?.ingridients.length, 0)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart without api guard and authentication.
   * ✔ Verify product data in cart response with the count of total products in cart.
   * ✔ Remove product from cart.
   * ✔ Verify product data in cart response with the count of total products in cart.
   */
  test('Guest users can add/remove products to their cart', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    let response = await client.post(route('api.carts.show')).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id }] })
    assert.equal(response.body()?.products.length, 1)

    response = await client.post(route('api.carts.update')).json({
      action: 'DETACH',
      products: [product.id],
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [] })
    assert.equal(response.body()?.products.length, 0)
  })

  /**
   * ✔ Request the cart page.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain empty products and ingridients arrays.
   */
  test('Authenticated user can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
    response.assertBodyContains({ products: [], ingridients: [] })
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart with api guard and authentication.
   * ✔ Verify product data in cart response with the count of total products in cart.
   * ✔ Remove product from cart.
   * ✔ Verify product data in cart response with the count of total products in cart.
   */
  test('Authenticated user can add/remove products to their cart', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    let response = await client.post(route('api.carts.show')).loginAs(user).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id }] })
    assert.equal(response.body()?.products.length, 1)

    // Sending request to remove the product from cart.
    response = await client.post(route('api.carts.update')).json({
      action: 'DETACH',
      products: [product.id],
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [] })
    assert.equal(response.body()?.products.length, 0)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart.
   * ✔ Verify the product and products length in cart response.
   * ✔ Each product should have pivot columns.
   */
  test('Cart product should contain the quantity added by the user.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    const response = await client.post(route('api.carts.show')).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

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
    assert.equal(response.body()?.products.length, 1)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart with a specific number of quantity.
   * ✔ Verify the quantity and the length of products in the cart response.
   * ✔ Again add the product to cart with decreased quantity by 1.
   * ✔ Verify the product decreased quantity and the length of product in response.
   */
  test('Cart product quantity can be decreased.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    const postData = {
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    }

    const assertData = {
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 5,
            pivot_product_id: product.id,
          },
        },
      ],
    }

    let response = await client.post(route('api.carts.show')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty--
    assertData.products[0].meta.pivot_qty--

    // Sending request to cart with decreased
    response = await client.post(route('api.carts.show')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart with a specific number of quantity.
   * ✔ Verify the quantity and the length of products in the cart response.
   * ✔ Again add the product to cart with increased quantity by 1.
   * ✔ Verify the product decreased quantity and the length of product in response.
   */
  test('Cart product quantity can be increased.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    const postData = {
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    }

    const assertData = {
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 5,
            pivot_product_id: product.id,
          },
        },
      ],
    }

    let response = await client.post(route('api.carts.show')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty++
    assertData.products[0].meta.pivot_qty++

    // Sending request to cart with decreased
    response = await client.post(route('api.carts.show')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)
  })
})
