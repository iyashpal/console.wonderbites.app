import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, IngredientFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [carts.update]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users can add products to their cart', async ({ client, route, assert }, qs) => {
    const product = await ProductFactory.create()
    let response = await client.put(route('api.carts.update', {}, { qs })).json({
      action: 'ADD',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id, meta: { pivot_qty: 5 } }] })
    assert.equal(response.body()?.products.length, 1)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Guest users can remove products from cart', async ({ client, route, assert }, qs) => {
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

    let response = await client.get(route('api.carts.show', {}, { qs }))

    response.assertStatus(200)

    response.assertBodyContains({
      products: products.map(({ id, name, description, sku, price }) => ({ id, name, description, sku, price })),
    })

    assert.equal(response.body()?.products.length, products.length)

    // pick product from cart list to remove.
    let product = products[0]

    response = await client.put(route('api.carts.update', {}, { qs }))
      .json({
        action: 'REMOVE',
        products: [product.id],
      })

    response.assertStatus(200)

    assert.notContainsSubset(response.body(), { products: [{ id: product.id, name: product.name }] })

    response.assertBodyContains({
      products: products.filter(({ id }) => id !== product.id)
        .map(({ id, name, description }) => ({ id, name, description })),
    })
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Authenticated user can add products to cart', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    let response = await client.put(route('api.carts.update', {}, { qs })).loginAs(user).json({
      action: 'ADD',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    response.assertStatus(200)
    response.assertBodyContains({ products: [{ id: product.id, meta: { pivot_qty: 5 } }] })
    assert.equal(response.body()?.products.length, 1)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Authenticated User can remove products from cart', async ({ client, route, assert }, qs) => {
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

    let response = await client.get(route('api.carts.show', {}, { qs })).guard('api')

      .loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      products: products.map(({ id, name, description, sku, price }) => ({ id, name, description, sku, price })),
    })

    assert.equal(response.body()?.products.length, products.length)

    // pick product from cart list to remove.
    let product = products[0]

    response = await client.put(route('api.carts.update', {}, { qs })).guard('api')

      .loginAs(user).json({
        action: 'REMOVE',
        products: [product.id],
      })

    response.assertStatus(200)

    assert.notContainsSubset(response.body(), { products: [{ id: product.id, name: product.name }] })

    response.assertBodyContains({
      products: products.filter(({ id }) => id !== product.id)
        .map(({ id, name, description }) => ({ id, name, description })),
    })
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Cart product should contain the quantity added by the user.', async ({ client, route, assert }, qs) => {
    const product = await ProductFactory.create()

    const response = await client.put(route('api.carts.update', {}, { qs })).json({
      action: 'ADD',
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
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Cart product quantity can be decreased.', async ({ client, route, assert }, qs) => {
    const product = await ProductFactory.create()

    const postData = {
      action: 'ADD',
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

    let response = await client.put(route('api.carts.update', {}, { qs })).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty--
    assertData.products[0].meta.pivot_qty--

    // Sending request to cart with decreased
    response = await client.put(route('api.carts.update', {}, { qs })).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('Cart product quantity can be increased.', async ({ client, route, assert }, qs) => {
    const product = await ProductFactory.create()

    const postData = {
      action: 'ADD',
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

    let response = await client.put(route('api.carts.update', {}, { qs })).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)

    // Prepare data for increase quantity
    postData.products[product.id].qty++
    assertData.products[0].meta.pivot_qty++

    // Sending request to cart with decreased
    response = await client.put(route('api.carts.update', {}, { qs })).json(postData)

    response.assertStatus(200)
    response.assertBodyContains(assertData)
    assert.equal(response.body()?.products.length, 1)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products'] }])

  test('It can add ingredients to cart.', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.create()

    const ingredient = await IngredientFactory.create()

    await user.cart.related('products').attach([product.id])

    const request = await client.put(route('api.carts.update', {}, { qs }))
      .guard('api').loginAs(user).json({
        action: 'ADD',
        ingredients: {
          [ingredient.id]: { product_id: product?.id },
        },
      })

    const { products, ingredients } = request.body()

    request.assertStatus(200)

    request.assertBodyContains({
      products: [{ id: product.id, name: product.name }],
      ingredients: [{ id: ingredient.id, name: ingredient.name }],
    })

    assert.equal(1, products.length)
    assert.equal(1, ingredients.length)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products', 'cart.ingredients'] }])

  test('It can add products and ingredients to cart.', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.create()

    const ingredient = await IngredientFactory.create()

    const request = await client.put(route('api.carts.update', {}, { qs }))
      .guard('api').loginAs(user).json({
        action: 'ADD',
        products: {
          [product.id]: { qty: 1 },
        },
        ingredients: {
          [ingredient.id]: { product_id: product?.id, qty: 1 },
        },
      })

    const { products, ingredients } = request.body()

    request.assertStatus(200)

    request.assertBodyContains({
      products: [{ id: product.id, name: product.name }],
      ingredients: [{ id: ingredient.id, name: ingredient.name }],
    })

    assert.equal(1, products.length)
    assert.equal(1, ingredients.length)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products', 'cart.ingredients'] }])

  test('It can update product\'s ingredients in cart.', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.create()

    const ingredient = await IngredientFactory.create()

    const request = await client.put(route('api.carts.update', {}, { qs }))
      .guard('api').loginAs(user).json({
        action: 'ADD',
        products: {
          [product.id]: { qty: 1 },
        },
        ingredients: {
          [ingredient.id]: { product_id: product?.id, qty: 1 },
        },
      })

    const { products, ingredients } = request.body()

    request.assertStatus(200)

    request.assertBodyContains({
      products: [{ id: product.id, name: product.name }],
      ingredients: [{ id: ingredient.id, name: ingredient.name }],
    })

    assert.equal(1, products.length)
    assert.equal(1, ingredients.length)
  }).tags(['@carts', '@carts.update', '@carts.debug']).with([{ with: ['cart.products', 'cart.ingredients'] }])

  test('It can remove products ingredients on removal of product from cart.', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.create()

    const ingredient = await IngredientFactory.create()

    await user.cart.related('products').attach([product.id])

    const request = await client.put(route('api.carts.update', {}, { qs }))
      .guard('api').loginAs(user).json({
        action: 'ADD',
        ingredients: {
          [ingredient.id]: { product_id: product.id },
        },
      })

    const { products, ingredients } = request.body()

    request.assertStatus(200)

    request.assertBodyContains({
      products: [{ id: product.id, name: product.name }],
      ingredients: [{ id: ingredient.id, name: ingredient.name }],
    })

    assert.equal(1, products.length)
    assert.equal(1, ingredients.length)

    const detachData = {
      action: 'REMOVE',
      products: [product.id],
    }
    const removeRequest = await client.put(route('api.carts.update', {}, { qs }))
      .guard('api').loginAs(user).json(detachData)

    removeRequest.assertStatus(200)

    assert.equal(0, removeRequest.body()?.products.length)
    assert.equal(0, removeRequest.body()?.ingredients.length)
  }).tags(['@carts', '@carts.update']).with([{ with: ['cart.products', 'cart.ingredients'] }])
})
