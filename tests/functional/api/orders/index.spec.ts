import {test} from '@japa/runner'
import {Order} from 'App/Models/index'
import Database from '@ioc:Adonis/Lucid/Database'
import {OrderStatus} from 'App/Models/Enums/Order'
import { OrderFactory, ProductFactory, ReviewFactory, UserFactory} from 'Database/factories'

test.group('API [orders.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow access to unauthenticated users.', async ({client, route}) => {
    const request = await client.get(route('api.orders.index'))

    request.assertStatus(401)
    request.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can allow the access to authenticated users.', async ({client, route}) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.orders.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({data: []})
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders.', async ({client, route}) => {
    const user = await UserFactory.with('addresses').create()
    const orders = await OrderFactory.merge({userId: user.id}).createMany(10)

    const request = await client.get(route('api.orders.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    request.assertBodyContains({
      data: orders.map(({id, userId, token, options, note, status}) => ({
        id, user_id: userId, token: token, options: JSON.stringify(options), note, status,
      })),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can filter {status} orders.')
    .with([{count: 2, status: 'past'}, {count: 6, status: 'upcoming'}])
    .run(async ({client, route, assert}, {count, status}) => {
      const user = await UserFactory.create()

      await OrderFactory.merge([
        {userId: user.id, status: OrderStatus.PREPARING},
        {userId: user.id, status: OrderStatus.IN_TRANSIT},
        {userId: user.id, status: OrderStatus.PLACED},
        {userId: user.id, status: OrderStatus.CONFIRMED},
        {userId: user.id, status: OrderStatus.PREPARING},
        {userId: user.id, status: OrderStatus.IN_TRANSIT},
        {userId: user.id, status: OrderStatus.DELIVERED},
        {userId: user.id, status: OrderStatus.CANCELLED},
      ]).createMany(8)

      const response = await client.get(route('api.orders.index', {}, {qs: {status}}))
        .guard('api').loginAs(user)

      response.assertStatus(200)

      assert.equal(response.body().data.length, count)
    }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders by status - "{name}".').with([
    {name: 'placed', status: OrderStatus.PLACED},
    {name: 'confirmed', status: OrderStatus.CONFIRMED},
    {name: 'preparing', status: OrderStatus.PREPARING},
    {name: 'in-transit', status: OrderStatus.IN_TRANSIT},
    {name: 'delivered', status: OrderStatus.DELIVERED},
    {name: 'canceled', status: OrderStatus.CANCELLED},
  ]).run(async ({client, route, assert}, order) => {
    const user = await UserFactory.create()
    await OrderFactory.merge({userId: user.id}).createMany(6)

    await OrderFactory.merge({userId: user.id, status: order.status}).createMany(3)

    const orders = (await Order.all()).filter(({status}) => status === order.status)

    const request = await client.get(route('api.orders.index', {}, {qs: {status: order.name}}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    assert.equal(request.body().data.length, orders.length)

    request.assertBodyContains({
      data: orders.map(({id, userId, token, options, note, status}) => ({
        id, user_id: userId, token: token, options: options, note, status,
      })),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can limit the list of orders.', async ({client, route, assert}) => {
    let limit = 10
    const user = await UserFactory.create()
    const orders = await OrderFactory.merge({userId: user.id}).createMany(20)

    let request = await client.get(route('api.orders.index', {}, {qs: {limit}}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({meta: {current_page: 1}, data: orders.map(({id}) => ({id})).slice(0, limit)})

    request = await client.get(route('api.orders.index', {}, {qs: {limit, page: 2}}))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    assert.equal(request.body().data.length, limit)
    request.assertBodyContains({meta: {current_page: 2}, data: orders.map(({id}) => ({id})).slice(limit)})
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders with products.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const products = await ProductFactory.createMany(5)
    const orders = await OrderFactory.merge({
      userId: user.id, data: products.map(product => ({id: product.id, quantity: 5})),
    }).createMany(10)

    const request = await client.get(route('api.orders.index', {}, {qs: {with: ['orders.products']}}))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const {data} = request.body()
    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id}) => ({
        id,
      })),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders with products and product images.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const orders = await OrderFactory.merge({userId: user.id}).createMany(10)

    const qs = {with: ['orders.products', 'orders.products.media']}

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)
    const {data} = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id}) => ({
        id,
      })),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders with ingredients.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const orders = await OrderFactory.merge({userId: user.id}).createMany(10)

    const qs = {with: ['orders.ingredients']}

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id, userId, token, options, note, status}) => ({
        id, user_id: userId, token: token, options: JSON.stringify(options), note, status,
      })),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list the orders with address.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const orders = await OrderFactory
      .merge({userId: user.id}).createMany(10)

    const request = await client.get(route('api.orders.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id}) => ({id})),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list orders with coupon.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const orders = await OrderFactory.with('coupon')
      .merge({userId: user.id}).createMany(10)

    const qs = {with: ['orders.coupon']}

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id, coupon}) => ({id, coupon_id: coupon.id, coupon: {id: coupon.id}})),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list orders with user.', async ({client, route, assert}) => {
    const user = await UserFactory.create()
    const orders = await OrderFactory.merge({userId: user.id}).createMany(10)

    const qs = {with: ['orders.user']}

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 10)

    request.assertBodyContains({
      data: orders.map(({id}) => ({id, user_id: user.id, user: {id: user.id}})),
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list orders with review.', async ({client, route, assert}) => {
    const user = await UserFactory.create()

    const order = await OrderFactory.merge({userId: user.id}).create()

    const review = await ReviewFactory.merge({
      reviewable: 'Order', reviewableId: order.id, userId: user.id,
    }).create()

    const qs = {with: ['orders.review']}

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 1)

    request.assertBodyContains({
      data: [{
        id: order.id,
        review: {id: review.id},
      }],
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])

  test('it can list orders with products, address, coupon, user etc.', async ({client, route, assert}) => {
    const user = await UserFactory.create()

    const order = await OrderFactory.with('coupon').merge({userId: user.id}).create()

    const review = await ReviewFactory.merge({
      reviewable: 'Order', reviewableId: order.id, userId: user.id,
    }).create()

    const qs = {
      with: [
        'orders.ingredients', 'orders.products', 'orders.products.media', 'orders.user',
        'orders.address', 'orders.coupon', 'orders.review',
      ],
    }

    const request = await client.get(route('api.orders.index', {}, {qs}))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    const {data} = request.body()

    assert.equal(data.length, 1)

    request.assertBodyContains({
      data: [{
        id: order.id,
        user_id: user.id,
        user: {id: user.id},
        options: JSON.stringify(order.options),
        coupon_id: order.coupon.id,
        coupon: {id: order.coupon.id},
        review: {id: review.id},
      }],
    })
  }).tags(['@api', '@api.orders', '@api.orders.index'])
})
