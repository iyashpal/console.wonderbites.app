import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CartFactory, CouponFactory, UserFactory} from 'Database/factories'

test.group('API [coupons.apply]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('coupon code can be applied to checkout/cart.', async ({client, route}) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({userId: user.id}).create()

    const coupon = await CouponFactory.merge({code: 'FRI24', expiredAt: DateTime.now().plus({minute: 1})}).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({coupon: coupon.code, cart: cart.id})

    response.assertStatus(200)
    response.assertBodyContains({
      id: coupon.id,
      code: coupon.code,
      discount_type: coupon.discountType,
      discount_value: coupon.discountValue,
    })
  }).tags(['@api', '@api.coupons', '@api.coupons.apply'])

  test('expired coupon code can not be applied to checkout/cart.', async ({client, route}) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({userId: user.id}).create()

    const coupon = await CouponFactory.merge({code: 'FRI24', expiredAt: DateTime.now().minus({day: 1})}).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({coupon: coupon.code, cart: cart.id})

    response.assertStatus(422)

    response.assertBodyContains({errors: {coupon: 'Coupon code is expired.'}})
  }).tags(['@api', '@api.coupons', '@api.coupons.apply'])

  test('it throws validation errors when coupon and cart is missing', async ({client, route, assert}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.coupons.apply')).guard('api')
      .loginAs(user)

    response.assertStatus(422)

    assert.properties(response.body().errors, ['coupon', 'cart'])
  }).tags(['@api', '@api.coupons', '@api.coupons.apply'])

  test('unknown coupon can not apply to cart.', async ({client, route}) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({userId: user.id}).create()

    const response = await client.post(route('api.coupons.apply')).guard('api')
      .loginAs(user)

      .json({coupon: 'MONDAY_MORNING', cart: cart.id})

    response.assertStatus(422)
    response.assertBodyContains({errors: {coupon: 'Invalid coupon code.'}})
  }).tags(['@api', '@api.coupons', '@api.coupons.apply'])
})
