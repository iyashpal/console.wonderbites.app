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
   * ✔ Need some coupons to list out.
   * ✔ Access the coupons list page.
   * ✔ See the list of coupons in response.
   */
  test('Only logged in user can list the coupons', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const coupons = await CouponFactory.createMany(10)

    const response = await client.get(route('api.coupons.index')).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains(coupons.map(({ id }) => ({ id })))
    assert.equal(response.body().length, coupons.length)
  })

  /**
   * ✔ See cart list without login.
   * ✔ assert request status as Unauthorized.
   */
  test('Guest users can not list the coupons', async ({ client, route }) => {
    const response = await client.get(route('api.coupons.index'))

    response.assertStatus(401)
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
   * ✔ Need a expired coupon to apply.
   * ✔ Post code and cart id to apply the coupon.
   * ✔ Assert expired error in response.
   */
  test('Expired coupon code can not be applied to checkout/cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const coupon = await CouponFactory.merge({ code: 'FRI24', expiredAt: DateTime.now().minus({ day: 1 }) }).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({ coupon: coupon.code, cart: cart.id })

    response.assertStatus(422)
    response.assertBodyContains({ messages: { coupon: ['Coupon code is expired.'] } })
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
