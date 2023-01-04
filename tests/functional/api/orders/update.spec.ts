import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { OrderStatus } from 'App/Models/Enums/Order'
import { OrderFactory, UserFactory } from 'Database/factories'

test.group('API [orders.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow un-authenticated users to cancel the order.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const order = await OrderFactory.merge({ userId: user.id })
      .with('products', 5, query => query.with('ingredients', 4)).create()

    const $response = await client.put(route('api.orders.cancel', order))

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@orders', '@orders.update', '@orders.cancel'])

  test('it can allow user to cancel the order.', async ({ client, route }) => {
    const user = await UserFactory.with('addresses', 1).create()

    const order = await OrderFactory.merge({
      userId: user.id, createdAt: DateTime.now().minus({ day: 1 }),
    })
      .with('products', 5, query => query.with('ingredients', 5)).create()

    const $response = await client.put(route('api.orders.cancel', order))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({ id: order.id, status: OrderStatus.CANCELED })
  }).tags(['@orders', '@orders.update', '@orders.cancel'])
})
