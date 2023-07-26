import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {OrderStatus} from 'App/Models/Enums/Order'
import {OrderFactory, UserFactory} from 'Database/factories'

test.group('API [orders.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow un-authenticated users to update the order.', async ({client, route}) => {
    const user = await UserFactory.create()

    const order = await OrderFactory.merge({userId: user.id}).create()

    const $response = await client.put(route('api.orders.update', order))

    $response.assertStatus(401)
    $response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@api.orders', '@api.orders.update', '@api.orders.update'])

  test('it do not allow user to update the order status without action.', async ({client, route}) => {
    const user = await UserFactory.with('addresses', 1).create()

    const order = await OrderFactory.merge({
      userId: user.id, createdAt: DateTime.now().minus({day: 1}),
    }).create()

    const $response = await client.put(route('api.orders.update', order))
      .guard('api').loginAs(user)

    $response.assertStatus(422)

    $response.assertBodyContains({errors: {action: 'required validation failed'}})
  }).tags(['@api', '@api.orders', '@api.orders.update', '@api.orders.update'])

  test('it do not allow user to update the order with a invalid action.', async ({client, route}) => {
    const user = await UserFactory.with('addresses', 1).create()

    const order = await OrderFactory.merge({
      userId: user.id, createdAt: DateTime.now().minus({day: 1}),
    }).create()

    const $response = await client.put(route('api.orders.update', order))
      .guard('api').loginAs(user).json({action: 'demo'})

    $response.assertStatus(422)

    $response.assertBodyContains({errors: {action: 'enum validation failed'}})
  }).tags(['@api', '@api.orders', '@api.orders.update', '@api.orders.update'])

  test('it allows user to update the order with a valid action.', async ({client, route}) => {
    const user = await UserFactory.with('addresses', 1).create()

    const order = await OrderFactory.merge({
      userId: user.id, createdAt: DateTime.now().minus({day: 1}),
    }).create()

    const $response = await client.put(route('api.orders.update', order))
      .guard('api').loginAs(user).json({action: 'cancel'})

    $response.assertStatus(200)

    $response.assertBodyContains({id: order.id, status: OrderStatus.CANCELLED})
  }).tags(['@api', '@api.orders', '@api.orders.update', '@api.orders.update'])
})
