import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { OrderFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [orders.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('unauthenticated user can not access order details', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()

    const order = await OrderFactory
      .merge({ userId: user.id, addressId: user.addresses[0].id })
      .with('coupon')
      .create()

    const request = await client.get(route('api.orders.show', order))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@orders', '@orders.show'])

  test('authenticated user can access order details', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()

    const order = await OrderFactory
      .merge({ userId: user.id, addressId: user.addresses[0].id })
      .create()

    const request = await client.get(route('api.orders.show', order))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id })
  }).tags(['@orders', '@orders.show'])

  test('it contain order products', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()
    const product = await ProductFactory.create()

    const order = await OrderFactory
      .merge({ userId: user.id, addressId: user.addresses[0].id })
      .with('coupon').create()

    await order.related('products').attach([product.id])

    const request = await client.get(route('api.orders.show', order, { qs: { with: ['order.products'] } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id, products: [{ id: product.id }] })
  }).tags(['@orders', '@orders.show'])

  test('it contain order ingredients', async ({ client, route }) => {
    const ingredients = {}
    const user = await UserFactory.with('addresses', 2).create()
    const product = await ProductFactory.with('ingredients', 3).create()

    product.ingredients.map(ingredient => ingredients[ingredient.id] = { product_id: product.id })

    const order = await OrderFactory.merge({ userId: user.id, addressId: user.addresses[0].id }).create()

    await order.related('products').attach([product.id])
    await order.related('ingredients').attach(ingredients)

    const request = await client.get(route('api.orders.show', order, { qs: { with: ['order.ingredients'] } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id, ingredients: product.ingredients.map(({ id }) => ({ id })) })
  }).tags(['@orders', '@orders.show'])

  test('it contain order coupon', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()

    const order = await OrderFactory
      .merge({ userId: user.id, addressId: user.addresses[0].id })
      .with('coupon')
      .create()

    const request = await client.get(route('api.orders.show', order, { qs: { with: ['order.coupon'] } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id, coupon: { id: order.coupon.id } })
  }).tags(['@orders', '@orders.show'])

  test('it contain order address', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()
    const address = user.addresses[0]

    const order = await OrderFactory
      .merge({ userId: user.id, addressId: address.id })
      .create()

    const request = await client.get(route('api.orders.show', order, { qs: { with: ['order.address'] } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id, address: { id: address.id } })
  }).tags(['@orders', '@orders.show'])

  test('it contain order user', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 2).create()

    const order = await OrderFactory.merge({ userId: user.id, addressId: user.addresses[0].id }).create()

    const request = await client.get(route('api.orders.show', order, { qs: { with: ['order.user'] } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: order.id, user: { id: user.id } })
  }).tags(['@orders', '@orders.show'])
})
