import { v4 as uuid } from 'uuid'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CartFactory, IngredientFactory, ProductFactory, UserFactory} from 'Database/factories'

test.group('API [carts.update]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It allows guest users to access and add products to the cart.', async ({ client, route, assert }, qs) => {
    const product = await ProductFactory.create()

    const request = await client.put(route('api.carts.update'))
      .json({data: [{id: product.id, quantity: 3}]})

    request.assertStatus(200)
    request.assertBodyContains({ data: [{id: product.id, quantity: 3}]})
  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('It allows authenticated users to access and add products to cart.', async ({ client, route, assert }, qs) => {
    const user = await UserFactory.with('cart').create()
    const product = await ProductFactory.create()

    const request = await client.put(route('api.carts.update'))
      .guard('api').loginAs(user).json({data: [{id: product.id, quantity: 3}]})

    request.assertStatus(200)
    request.assertBodyContains({ id: user.cart.id, user_id: user.id, data: [{id: product.id, quantity: 3}]})
  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('It allows users to add variable products to cart', async ({client, route, assert}, qs) => {
    const product = await ProductFactory.with('variants', 2).create()
    const [variant] = product.variants

    const request = await client.put(route('api.carts.update'))
      .json({data: [{id: product.id, quantity: 3, variant: {id: variant.id}}]})

    request.assertStatus(200)
    request.assertBodyContains({ data: [{ id: product.id, quantity: 3, variant: {id: variant.id} }]})
  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('It allows users to add variable products with attributes to cart', async ({client, route, assert}, qs) => {
    const product = await ProductFactory
      .with('variants', 2, query => query.with('attributes', 5).with('categories'))
      .create()

    const [variant] = product.variants.map(variant => {
      return {
        id: variant.id,
        attributes: variant.attributes.map((attribute) => {
          const [category] = variant.categories
          return {
            id: attribute.id,
            quantity: 5,
            category: category.id,
          }
        }),
      }
    })

    const request = await client.put(route('api.carts.update'))
      .json({data: [{id: product.id, quantity: 3,variant}]})

    request.assertStatus(200)
    request.assertBodyContains({ data: [{ id: product.id, quantity: 3,variant}]})
  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('Authenticated User can remove products from cart', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('Cart product should contain the quantity added by the user.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('Cart product quantity can be decreased.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products'] }])

  test('It can add ingredients to cart.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products', 'cart.ingredients'] }])

  test('It can add products and ingredients to cart.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products', 'cart.ingredients'] }])

  test('It can update product\'s ingredients in cart.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{with: ['cart.products', 'cart.ingredients']}])

  test('It can remove products ingredients on removal of product from cart.', async ({client, route, assert}, qs) => {

  }).tags(['@api', '@api.carts', '@api.carts.update'])
    .with([{ with: ['cart.products', 'cart.ingredients'] }])
})
