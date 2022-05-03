import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, CouponFactory, UserFactory } from 'Database/factories'

test.group('Api coupons', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('apply coupon to checkout', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const coupon = await CouponFactory.merge({ code: 'FRI24', expiredAt: DateTime.now().plus({ minute: 1 }) }).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({ coupon: coupon.code, cart: cart.id })

    response.assertStatus(200)

    // response.dumpBody()
  })
})
