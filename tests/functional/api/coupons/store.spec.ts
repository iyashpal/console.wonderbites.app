import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CouponFactory, UserFactory } from 'Database/factories'

test.group('API [coupons.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('only authenticated user can create new coupon', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await (await CouponFactory.make()).toObject()

    const response = await client.post(route('api.coupons.store')).guard('api')
      .loginAs(user).json(coupon)

    response.assertStatus(200)
    response.assertBodyContains({ title: coupon.title, description: coupon.description, code: coupon.code })
  }).tags(['@coupons', '@coupons.store'])

  test('unauthenticated user can not create new coupon', async ({ client, route }) => {
    const coupon = await (await CouponFactory.make()).toObject()

    const response = await client.post(route('api.coupons.store')).json(coupon)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@coupons', '@coupons.store'])
})
