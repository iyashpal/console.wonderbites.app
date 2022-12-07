import { Order } from 'App/Models'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { IngredientFactory, OrderFactory, ReviewFactory, UserFactory } from 'Database/factories'
import { OrderStatus } from 'App/Models/Enums/Order'

test.group('API [orders.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow access to unauthenticated users.', async ({ client, route }) => {
    const request = await client.get(route('api.orders.index'))

    request.assertStatus(401)
    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@orders', '@orders.index'])

  test('it can allow the access to authenticated users.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.orders.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({ data: [] })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders.', async ({ client, route }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.merge({ userId: user.id, addressId: address.id }).createMany(10)

    const request = await client.get(route('api.orders.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({
      data: orders.map(({ id, userId, addressId, ipAddress, paymentMethod, note, status }) => ({
        id, user_id: userId, address_id: addressId,
        ip_address: ipAddress, payment_method: paymentMethod, note, status,
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders by status - "{name}".').with([
    { name: 'upcoming', status: OrderStatus.UPCOMING },
    { name: 'preparing', status: OrderStatus.PREPARING },
    { name: 'delivered', status: OrderStatus.DELIVERED },
    { name: 'canceled', status: OrderStatus.CANCELED },
  ]).run(async ({ client, route, assert }, order) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    await OrderFactory.merge({ userId: user.id, addressId: address.id }).createMany(6)

    await OrderFactory.merge({ userId: user.id, addressId: address.id, status: order.status }).createMany(3)

    const orders = (await Order.all()).filter(({ status }) => status === order.status)

    const request = await client.get(route('api.orders.index', {}, { qs: { status: order.name } }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    assert.equal(request.body().data.length, orders.length)

    request.assertBodyContains({
      data: orders.map(({ id, userId, addressId, ipAddress, paymentMethod, note, status }) => ({
        id, user_id: userId, address_id: addressId,
        ip_address: ipAddress, payment_method: paymentMethod, note, status,
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can limit the list of orders.', async ({ client, route, assert }) => {
    let limit = 10
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.merge({ userId: user.id, addressId: address.id }).createMany(20)

    let request = await client.get(route('api.orders.index', {}, { qs: { limit } }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({ meta: { current_page: 1 }, data: orders.map(({ id }) => ({ id })).slice(0, limit) })

    request = await client.get(route('api.orders.index', {}, { qs: { limit, page: 2 } }))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({ meta: { current_page: 2 }, data: orders.map(({ id }) => ({ id })).slice(limit) })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders with products.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.with('products', 3)
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const request = await client.get(route('api.orders.index', {}, { qs: { with: ['orders.products'] } }))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name }) => ({ id, name })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders with products and product images.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory
      .with('products', 3, product => product.with('media', 10))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['orders.products', 'orders.products.media'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name, media }) => ({
          id, name,
          media: media.map(({ id, title, caption, filePath }) => ({ id, title, caption, file_path: filePath })),
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders with ingredients.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const ingredients = await IngredientFactory.createMany(5)
    const orders = await OrderFactory.with('products', 1)
      .with('ingredients', 3, builder => builder.pivotAttributes({ product_id: 1 }))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    orders.map(async (order) => {
      let data = {}
      ingredients.map(({ id }) => {
        data[id] = { product_id: 1 }
      })

      await order.related('ingredients').attach(data)

      await order.load('ingredients')
    })

    const qs = { with: ['orders.ingredients'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, userId, addressId, ipAddress, paymentMethod, note, status, ingredients }) => ({
        id, user_id: userId, address_id: addressId,
        ip_address: ipAddress, payment_method: paymentMethod, note, status,
        ingredients: ingredients.map(({ id, name, description, price, status }) => ({
          id, name, description, price, status,
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list the orders with address.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [{ id: addressID }] = user.addresses
    const orders = await OrderFactory
      .merge({ userId: user.id, addressId: addressID }).createMany(10)

    orders.map(async (order) => await order.load('address'))

    const qs = { with: ['orders.address'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, address }) => ({
        id,
        address_id: address.id,
        address: {
          id: address.id,
        },
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list orders with coupon.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.with('products', 1).with('coupon')
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['orders.coupon'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, coupon }) => ({ id, coupon_id: coupon.id, coupon: { id: coupon.id } })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list orders with user.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.with('products', 1)
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['orders.user'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id }) => ({ id, user_id: user.id, user: { id: user.id } })),
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list orders with review.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()

    const [address] = user.addresses

    const order = await OrderFactory.with('products', 1)
      .merge({ userId: user.id, addressId: address.id }).create()

    const review = await ReviewFactory.merge({ reviewable: 'Order', reviewableId: order.id, userId: user.id }).create()

    const qs = { with: ['orders.review'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 1)

    request.assertBodyContains({
      data: [{
        id: order.id,
        review: { id: review.id },
      }],
    })
  }).tags(['@orders', '@orders.index'])

  test('it can list orders with products, address, coupon, user etc.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()

    const [address] = user.addresses

    const ingredients = await IngredientFactory.createMany(5)

    const order = await OrderFactory.with('coupon')
      .with('products', 3, product => product.with('media', 10))
      .merge({ userId: user.id, addressId: address.id }).create()

    const review = await ReviewFactory.merge({ reviewable: 'Order', reviewableId: order.id, userId: user.id }).create()

    const [product] = order.products

    let ingredientData = {}
    ingredients.map(({ id }) => {
      ingredientData[id] = { product_id: product.id, qty: 4 }
    })

    await order.related('ingredients').attach(ingredientData)

    await order.load('ingredients')

    const qs = {
      with: [
        'orders.ingredients', 'orders.products', 'orders.products.media', 'orders.user',
        'orders.address', 'orders.coupon', 'orders.review',
      ],
    }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const { data } = request.body()

    assert.equal(data.length, 1)

    request.assertBodyContains({
      data: [{
        id: order.id,
        user_id: user.id,
        user: { id: user.id },
        address_id: address.id,
        coupon_id: order.coupon.id,
        address: { id: address.id },
        coupon: { id: order.coupon.id },
        review: { id: review.id },
        products: order.products.map(({ id, media }) => ({
          id, media: media.map(({ id }) => ({ id })),
        })),
        ingredients: ingredients.map(({ id }) => ({ id })),
      }],
    })
  }).tags(['@orders', '@orders.index'])
})
