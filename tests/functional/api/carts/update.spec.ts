import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CartFactory, ProductFactory, UserFactory} from 'Database/factories'

test.group('API [carts.update]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It allows guest users to access and add products to the cart.')
    .run(async ({ client, route, assert }, qs) => {
      const cart = await CartFactory.create()
      const product = await ProductFactory.create()
      const request = await client.put(route('api.carts.update', cart, qs))
        .json({data: [{id: product.id, quantity: 3}]})

      request.assertStatus(200)
      request.assertBodyContains({data: [{id: product.id, quantity: 3}]})
    }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows authenticated users to access and add products to cart.', async ({client, route, assert}, qs) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('cart').create()

    const request = await client.put(route('api.carts.update', user.cart, qs))
      .guard('api').loginAs(user).json({data: [{id: product.id, quantity: 3}]})

    request.assertStatus(200)

    request.assertBodyContains({
      id: user.cart.id,
      token: user.cart.token,
      data: [{id: product.id, quantity: 3}],
    })
  }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows users to add variable products to cart', async ({ client, route, assert }, qs) => {
    const cart = await CartFactory.create()
    const product = await ProductFactory.with('variants', 2).create()
    const [variant] = product.variants

    const request = await client.put(route('api.carts.update', cart, qs))
      .json({data: [{id: product.id, quantity: 3, variant: {id: variant.id}}]})

    request.assertStatus(200)
    request.assertBodyContains({data: [{id: product.id, quantity: 3, variant: {id: variant.id}}]})
  }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows users to add variable products with attributes to cart', async ({ client, route, assert }, qs) => {
    const cart = await UserFactory.create()
    const product = await ProductFactory
      .with('variants', 2, query => query.with('ingredients', 5).with('categories'))
      .create()

    const [variant] = product.variants.map(variant => {
      return {
        id: variant.id,
        ingredients: variant.ingredients.map((attribute) => {
          return {
            id: attribute.id,
            quantity: 5,
            category: variant.categories[0].id,
          }
        }),
      }
    })

    const request = await client.put(route('api.carts.update', cart, qs))
      .json({data: [{id: product.id, quantity: 3, variant}]})

    request.assertStatus(200)
    request.assertBodyContains({data: [{id: product.id, quantity: 3, variant}]})
  }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows users to remove the products from cart', async ({client, route, assert}, qs) => {
    const product = await ProductFactory
      .with('variants', 2, query => query.with('ingredients', 5).with('categories'))
      .with('categories').create()

    const [variant] = product.variants.map(variant => {
      return {
        id: variant.id,
        ingredients: variant.ingredients.map((attribute) => {
          const [category] = variant.categories
          return {id: attribute.id, quantity: 5, category: category.id}
        }),
      }
    })

    const data = [{ id: product.id, quantity: 3, variant }]
    const cart = await CartFactory.merge({ data }).create()
    const request = await client.put(route('api.carts.update', cart, qs)).json({data: []})

    request.assertStatus(200)
    request.assertBodyContains({id: cart.id, token: cart.token, data: [], status: cart.status})
  }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It throw error when cart product do not have the quantity.')
    .run(async ({client, route, assert}, qs) => {
      const product = await ProductFactory.create()
      const user = await UserFactory.with('cart').create()
      const request = await client.put(route('api.carts.update', user.cart, qs))
        .guard('api').loginAs(user).json({data: [{id: product.id}]})

      request.assertStatus(422)
      request.assertBodyContains({errors: {'data.0.quantity': 'required validation failed'}})
    }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows product quantity to be decreased.', async ({client, route, assert}, qs) => {
    const user = await UserFactory.with('cart').create()
    const product = await ProductFactory.with('categories', 1).create()
    await user.cart.merge({data: [{id: product.id, quantity: 5}]}).save()

    const request = await client.put(route('api.carts.update', user.cart, qs))
      .guard('api').loginAs(user).json({data: [{id: product.id, quantity: 2}]})

    request.assertStatus(200)
    request.assertBodyContains({data: [{id: product.id, quantity: 2}]})
  }).with([{with: ['cart.products']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It allows users to add add ingredients to the cart.', async ({client, route, assert}, qs) => {
    const product = await ProductFactory.with('categories')
      .with('ingredients', 5, query => query.with('categories')).create()
    const user = await UserFactory.with('cart').create()

    await user.cart.merge({data: [{id: product.id, quantity: 5}]}).save()

    const ingredients = product.ingredients.map(ingredient => {
      const [category] = ingredient.categories
      return {id: ingredient.id, quantity: 1, category: category.id}
    })

    const request = await client.put(route('api.carts.update', user.cart, qs))
      .guard('api').loginAs(user).json({data: [{id: product.id, quantity: 2, ingredients}]})

    request.assertStatus(200)
    request.assertBodyContains({data: [{id: product.id, quantity: 2, ingredients}]})
  }).with([{with: ['cart.products', 'cart.ingredients']}]).tags(['@api', '@api.carts', '@api.carts.update'])

  test('It do not allow users to add ingredients without quantity to the cart.')
    .run(async ({client, route, assert}, qs) => {
      const user = await UserFactory.with('cart').create()
      const product = await ProductFactory.with('ingredients', 5, query => query.with('categories')).create()

      await user.cart.merge({data: [{id: product.id, quantity: 5}]}).save()

      const ingredients = product.ingredients.map(ingredient => {
        return {id: ingredient.id, quantity: 1}
      })

      const request = await client.put(route('api.carts.update', user.cart, qs))
        .guard('api').loginAs(user)
        .json({data: [{id: product.id, quantity: 2, ingredients}]})

      request.assertStatus(422)
      request.assertBodyContains({
        errors: {
          'data.0.ingredients.0.category': 'required validation failed',
          'data.0.ingredients.1.category': 'required validation failed',
          'data.0.ingredients.2.category': 'required validation failed',
          'data.0.ingredients.3.category': 'required validation failed',
          'data.0.ingredients.4.category': 'required validation failed',
        },
      })
    }).with([{with: ['cart.products', 'cart.ingredients']}]).tags(['@api', '@api.carts', '@api.carts.update'])
})
