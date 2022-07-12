import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, UserFactory } from 'Database/factories'
import WonderpointFactory from 'Database/factories/WonderpointFactory'
import RedeemedWonderpointFactory from 'Database/factories/RedeemedWonderpointFactory'

test.group('API wonderpoints', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
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

    const redeemedWonderpoint = await RedeemedWonderpointFactory.merge({
      userId: user.id,
      cartId: cart.id,
      points: 50,
    }).create()

    const redeemedResponse = await client.get(route('api.wonderpoints.avail')).guard('api')
      // @ts-ignore
      .loginAs(user)

    redeemedResponse.assertBodyContains({ wonderpoints: totalPoints - redeemedWonderpoint.points })
  })
})
