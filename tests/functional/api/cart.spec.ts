import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('Api cart', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users can access the cart', async ({ client, route, assert }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
    assert.equal(response.body()?.products.length, 0)
    assert.equal(response.body()?.ingredients.length, 0)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart without api guard and authentication.
   * ✔ Verify product data in cart response with the count of total products in cart.
   */
  test('Guest users can add products to their cart', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    let response = await client.put(route('api.carts.update')).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id, meta: { pivot_qty: 5 } }] })
    assert.equal(response.body()?.products.length, 1)
  })

  /**
   * ✔ Need a cart for the guest user.
   * ✔ Need at least 5 products in the cart.
   * ✔ Request to remove a product from the cart.
   * ✔ Verify the removed product shouldn't be in the response body.
   * ✔ Verify the products excluding the removed one are still in the cart product list.
   */
  test('Guest users can remove products from cart', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const cart = await CartFactory.merge({ ipAddress: '127.0.0.1' }).create()
    const products = await ProductFactory.merge([
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
    ]).createMany(5)

    await products.map(async ({ id }) => cart.related('products').attach({ [id]: { qty: 1 } }))

    let response = await client.get(route('api.carts.show'))

    response.assertStatus(200)

    response.assertBodyContains({
      products: products.map(({ id, name, description, sku, price }) => ({ id, name, description, sku, price })),
    })

    assert.equal(response.body()?.products.length, products.length)

    // pick product from cart list to remove.
    let product = products[0]

    response = await client.put(route('api.carts.update'))
      .json({
        action: 'DETACH',
        products: [product.id],
      })

    response.assertStatus(200)

    assert.notContainsSubset(response.body(), { products: [{ id: product.id, name: product.name }] })

    response.assertBodyContains({
      products: products.filter(({ id }) => id !== product.id)
        .map(({ id, name, description }) => ({ id, name, description })),
    })
  })

  /**
   * ✔ Request the cart page.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain empty products and ingredients arrays.
   */
  test('Authenticated user can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)
    response.assertBodyContains({ products: [], ingredients: [] })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need a inactive cart to attach to the user.
   * ✔ Access logged in user cart.
   * ✔ Match accessed cart id with attached inactive cart.
   */
  test('Only active carts are accessible.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const cart = await CartFactory.merge({ userId: user.id, status: 0 }).create()

    const response = await client.get(route('api.carts.show')).guard('api')
      // @ts-ignore
      .loginAs(user)

    assert.notEqual(response.body()?.id, cart.id)
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart with api guard and authentication.
   * ✔ Verify product data in cart response with the count of total products in cart.
   * ✔ Remove product from cart.
   * ✔ Verify product data in cart response with the count of total products in cart.
   */
  test('Authenticated user can add products to cart', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    let response = await client.put(route('api.carts.update')).loginAs(user).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id, meta: { pivot_qty: 5 } }] })
    assert.equal(response.body()?.products.length, 1)
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need a cart for the user.
   * ✔ Need at least 5 products in the cart.
   * ✔ Request to remove a product from the cart.
   * ✔ Verify the removed product shouldn't be in the response body.
   * ✔ Verify the products excluding the removed one are still in the cart product list.
   */
  test('Authenticated User can remove products from cart', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const products = await ProductFactory.merge([
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
      { userId: user.id },
    ]).createMany(5)

    products.map(({ id }) => cart.related('products').attach({ [id]: { qty: 1 } }))

    let response = await client.get(route('api.carts.show')).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      products: products.map(({ id, name, description, sku, price }) => ({ id, name, description, sku, price })),
    })

    assert.equal(response.body()?.products.length, products.length)

    // pick product from cart list to remove.
    let product = products[0]

    response = await client.put(route('api.carts.update')).guard('api')

      // @ts-ignore
      .loginAs(user).json({
        action: 'DETACH',
        products: [product.id],
      })

    response.assertStatus(200)

    assert.notContainsSubset(response.body(), { products: [{ id: product.id, name: product.name }] })

    response.assertBodyContains({
      products: products.filter(({ id }) => id !== product.id)
        .map(({ id, name, description }) => ({ id, name, description })),
    })
  })

  /**
   * ✔ Need a product.
   * ✔ Add product to cart.
   * ✔ Verify the product and products length in cart response.
   * ✔ Each product should have pivot columns.
   */
  test('Cart product should contain the quantity added by the user.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()

    const response = await client.put(route('api.carts.update')).json({
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

    let response = await client.put(route('api.carts.update')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty--
    assertData.products[0].meta.pivot_qty--

    // Sending request to cart with decreased
    response = await client.put(route('api.carts.update')).json(postData)

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

    let response = await client.put(route('api.carts.update')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty++
    assertData.products[0].meta.pivot_qty++

    // Sending request to cart with decreased
    response = await client.put(route('api.carts.update')).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)
  })
})
