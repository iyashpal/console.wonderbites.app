import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, UserFactory, WonderPointFactory } from 'Database/factories'

test.group('API [wonder-points.avail]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group. 
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users can not avail the wonder points.', async ({ client, route }) => {
    const response = await client.get(route('api.wonder-points.avail'))
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.avail'])

  test('Authenticated users can avail the wonder points.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.get(route('api.wonder-points.avail')).guard('api')
      .loginAs(user)

    response.assertBodyContains({ wonder_points: 0 })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.avail'])

  test('Avail wonder points after redemption of some wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const wonderPoints = await WonderPointFactory.merge([
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
    ]).createMany(3)

    const totalPoints = wonderPoints.reduce((value, wonderPoint) => value + wonderPoint.points, 0)

    const wonderPointsResponse = await client.get(route('api.wonder-points.avail')).guard('api')
      .loginAs(user)

    wonderPointsResponse.assertBodyContains({ wonder_points: totalPoints })

    const redeemedWonderPoints = await WonderPointFactory.merge({
      points: 50,
      userId: user.id,
      action: 'redeem',
      extras: { cart_id: cart.id },
    }).create()

    const redeemedResponse = await client.get(route('api.wonder-points.avail')).guard('api')
      .loginAs(user)

    redeemedResponse.assertBodyContains({ wonder_points: totalPoints - redeemedWonderPoints.points })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.avail'])

  test('Users can redeem wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()

    await WonderPointFactory.merge([
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
    ]).createMany(3)

    const redeemResponse = await client.post(route('api.wonder_points.store')).guard('api')
      .loginAs(user).accept('json')
      .json({ event: 'Login', action: 'redeem', points: 100, extras: { cart_id: 1 } })

    redeemResponse.assertBodyContains({ points: 100 })

    const availResponse = await client.get(route('api.wonder-points.avail')).guard('api')
      .loginAs(user)

    availResponse.assertBodyContains({ wonder_points: 50 })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.avail'])
})
