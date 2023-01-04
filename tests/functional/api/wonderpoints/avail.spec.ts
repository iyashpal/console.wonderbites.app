import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, UserFactory, WonderpointFactory } from 'Database/factories'

test.group('API [wonderpoints.avail]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users can not avail the wonderpoints.', async ({ client, route }) => {
    const response = await client.get(route('api.wonderpoints.avail'))
    response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@wonderpoints', '@wonderpoints.avail'])

  test('Authenticated users can avail the wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.get(route('api.wonderpoints.avail')).guard('api')
      .loginAs(user)

    response.assertBodyContains({ wonderpoints: 0 })
  }).tags(['@wonderpoints', '@wonderpoints.avail'])

  test('Avail wonderpoints after redemption of some wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ user_id: user.id }).create()

    const wonderpoints = await WonderpointFactory.merge([
      { user_id: user.id, points: 50 },
      { user_id: user.id, points: 50 },
      { user_id: user.id, points: 50 },
    ]).createMany(3)

    const totalPoints = wonderpoints.reduce((value, wonderpoint) => value + wonderpoint.points, 0)

    const wonderpointsResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      .loginAs(user)

    wonderpointsResponse.assertBodyContains({ wonderpoints: totalPoints })

    const redeemedWonderpoint = await WonderpointFactory.merge({
      points: 50,
      user_id: user.id,
      action: 'redeem',
      extras: { cart_id: cart.id },
    }).create()

    const redeemedResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      .loginAs(user)

    redeemedResponse.assertBodyContains({ wonderpoints: totalPoints - redeemedWonderpoint.points })
  }).tags(['@wonderpoints', '@wonderpoints.avail'])

  test('Users can redeem wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()

    await WonderpointFactory.merge([
      { user_id: user.id, points: 50 },
      { user_id: user.id, points: 50 },
      { user_id: user.id, points: 50 },
    ]).createMany(3)

    const redeemResponse = await client.post(route('api.wonderpoints.store')).guard('api')
      .loginAs(user).accept('json')
      .json({ event: 'Login', action: 'redeem', points: 100, extras: { cart_id: 1 } })

    redeemResponse.assertBodyContains({ points: 100 })

    const availResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      .loginAs(user)

    availResponse.assertBodyContains({ wonderpoints: 50 })
  }).tags(['@wonderpoints', '@wonderpoints.avail'])
})
