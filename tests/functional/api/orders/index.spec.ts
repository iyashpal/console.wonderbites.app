import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { OrderFactory, UserFactory } from 'Database/factories'

test.group('API [orders.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('unauthenticated user can not access the orders history.', async ({ client, route }) => {
    const request = await client.get(route('api.orders.index'))

    request.assertStatus(401)
    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@orders', '@orders.index'])

  test('authenticated user can access the orders history.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.orders.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({ data: [] })
  }).tags(['@orders', '@orders.index'])

  test('it should contain the list of orders.', async ({ client, route }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.merge({ userId: user.id, addressId: address.id }).createMany(10)

    const request = await client.get(route('api.orders.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({ data: orders.map(({ id }) => ({ id })) })
  }).tags(['@orders', '@orders.index'])

  test('it should limit the list of orders.', async ({ client, route, assert }) => {
    let limit = 10
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.merge({ userId: user.id, addressId: address.id }).createMany(20)

    let request = await client.get(route('api.orders.index', {}, { qs: { limit } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({ meta: { current_page: 1 }, data: orders.map(({ id }) => ({ id })).slice(0, limit) })

    request = await client.get(route('api.orders.index', {}, { qs: { limit, page: 2 } }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({ meta: { current_page: 2 }, data: orders.map(({ id }) => ({ id })).slice(limit) })
  }).tags(['@orders', '@orders.index'])

  test('list of orders should contain products.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory.with('products', 3)
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const request = await client.get(route('api.orders.index', {}, { qs: { with: ['order.products'] } }))
      // @ts-ignore
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

  test('list of orders should contain products with media.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory
      .with('products', 3, product => product.with('media', 10))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['order.products', 'order.products.media'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name, media }) => ({
          id,
          name,
          media: media.map(({ id, title, caption, filePath }) => ({ id, title, caption, file_path: filePath })),
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('list of orders should contain products and ingredients.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory
      .with('products', 3, product => product.with('ingredients', 10))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    orders.map(async (order) => {

    })

    const qs = { with: ['order.products', 'order.products.media'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name, media }) => ({
          id,
          name,
          media: media.map(({ id, title, caption, filePath }) => ({
            id,
            title,
            caption,
            file_path: filePath,
          })),
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('list of orders should contain address.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [{ id: addressID }] = user.addresses
    const orders = await OrderFactory
      .merge({ userId: user.id, addressId: addressID }).createMany(10)

    orders.map(async (order) => await order.load('address'))

    const qs = { with: ['order.address'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      // @ts-ignore
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

  test('list of orders should contain products and ingredients.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory
      .with('products', 3, product => product.with('ingredients', 10))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['order.products', 'order.products.media'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name, media }) => ({
          id,
          name,
          media: media.map(({ id, title, caption, filePath }) => ({
            id,
            title,
            caption,
            file_path: filePath,
          })),
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])

  test('list of orders should contain products and ingredients.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('addresses').create()
    const [address] = user.addresses
    const orders = await OrderFactory
      .with('products', 3, product => product.with('ingredients', 10))
      .merge({ userId: user.id, addressId: address.id }).createMany(10)

    const qs = { with: ['order.products', 'order.products.media'] }

    const request = await client.get(route('api.orders.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const { data } = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({ id, products }) => ({
        id,
        products: products.map(({ id, name, media }) => ({
          id,
          name,
          media: media.map(({ id, title, caption, filePath }) => ({
            id,
            title,
            caption,
            file_path: filePath,
          })),
        })),
      })),
    })
  }).tags(['@orders', '@orders.index'])
})
