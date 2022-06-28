import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, CouponFactory, UserFactory } from 'Database/factories'

test.group('Api coupons', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need cart attached to the user.
   * ✔ Need a coupon to apply.
   * ✔ Post code and cart id to apply the coupon.
   * ✔ Get the coupon details in response.
   */
  test('Coupon code can be applied to checkout/cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const coupon = await CouponFactory.merge({ code: 'FRI24', expiredAt: DateTime.now().plus({ minute: 1 }) }).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({ coupon: coupon.code, cart: cart.id })

    response.assertStatus(200)
    response.assertBodyContains({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need cart attached to the user.
   * ✔ Post a invalid coupon code and cart id to apply the coupon.
   * ✔ Assert errors in response.
   */
  test('Unknown coupon can not apply to cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const response = await client.post(route('api.coupons.apply')).guard('api')
      // @ts-ignore
      .loginAs(user)

      .json({ coupon: 'MONDAY_MORNING', cart: cart.id })

    response.assertStatus(422)
    response.assertBodyContains({ messages: { coupon: ['Invalid coupon code.'] } })
  })
})
