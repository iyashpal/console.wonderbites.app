import { test } from '@japa/runner'
import { Coupon } from 'App/Models'
import Database from '@ioc:Adonis/Lucid/Database'
import { CouponFactory, UserFactory } from 'Database/factories'

test.group('API [coupons.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('only authenticated user can delete a coupon.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.delete(route('api.coupons.destroy', { id: coupon.id })).guard('api')

      .loginAs(user)

    response.assertStatus(200)

    const couponAfterDelete = await Coupon.find(coupon.id)
    assert.notEqual({
      id: couponAfterDelete?.id,
    }, { id: coupon.id })
  }).tags(['@coupons', '@coupons.destroy'])

  test('un-authenticated user can not delete a coupon.', async ({ client, route, assert }) => {
    const coupon = await CouponFactory.create()

    const response = await client.delete(route('api.coupons.destroy', { id: coupon.id }))

    response.assertStatus(401)

    const couponAfterDelete = await Coupon.find(coupon.id)

    assert.equal(couponAfterDelete?.id, coupon.id)
  }).tags(['@coupons', '@coupons.destroy'])
})
