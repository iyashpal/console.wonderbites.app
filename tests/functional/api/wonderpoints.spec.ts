import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, UserFactory } from 'Database/factories'
import WonderpointFactory from 'Database/factories/WonderpointFactory'

test.group('API wonderpoints', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * ✔ Access url to see the list of earned wonderpoints without login.
   * ✔ Response body should contain 'Unauthenticated' message.
   */
  test('Guest users cannot access the wonderpoints list.', async ({ client, route }) => {
    const response = await client.get(route('api.wonderpoints.index'))

    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need some mixed wonderpoints associated with user.
   * ✔ Access wonderpoints listing url.
   * ✔ Response body should contain wonderpoints associated with the user.
   */
  test('Authenticated users can access their wonderpoints earnings.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const wonderpoints = await WonderpointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonderpoints.index')).guard('api')
      // @ts-ignore
      .loginAs(user)

    // response.dumpBody()

    response.assertBodyContains({
      meta: {
        total: 2,
        per_page: 10,
        current_page: 1,
      },
      data: [
        { id: wonderpoints[0].id, user_id: user.id, action: 'earn' },
        { id: wonderpoints[1].id, user_id: user.id, action: 'redeem' },
      ],
    })
  })

  /**
   * ✔ Access url to avail wonderpoints without login.
   * ✔ Response body should contain 'Unauthenticated' message.
   */
  test('Guest users can not avail the wonderpoints.', async ({ client, route }) => {
    const response = await client.get(route('api.wonderpoints.avail'))
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Access url to avail wonderpoints with user authentication.
   * ✔ Response body should contain 0 wonderpoints.
   */
  test('Authenticated users can avail the wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.get(route('api.wonderpoints.avail')).guard('api')
      // @ts-ignore
      .loginAs(user)

    response.assertBodyContains({ wonderpoints: 0 })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need a cart associated with user.
   * ✔ Need some wonderpoints associated with user.
   * ✔ Avail wonderpoints to redeem.
   * ✔ Redeem some wonderpoints.
   * ✔ Avail wonderpoints after redumption.
   * ✔ Assert see the reduced wonderpoints.
   */
  test('Avail wonderpoints after redumption of some wonderpoints.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const wonderpoints = await WonderpointFactory.merge([
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
      { userId: user.id, points: 50 },
    ]).createMany(3)

    const totalPoints = wonderpoints.reduce((value, wonderpoint) => value + wonderpoint.points, 0)

    const wonderpointsResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      // @ts-ignore
      .loginAs(user)

    wonderpointsResponse.assertBodyContains({ wonderpoints: totalPoints })

    const redeemedWonderpoint = await WonderpointFactory.merge({
      userId: user.id,
      action: 'redeem',
      points: 50,
      extras: JSON.stringify({ cart_id: cart.id }),
    }).create()

    const redeemedResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      // @ts-ignore
      .loginAs(user)

    redeemedResponse.assertBodyContains({ wonderpoints: totalPoints - redeemedWonderpoint.points })
  })
})
