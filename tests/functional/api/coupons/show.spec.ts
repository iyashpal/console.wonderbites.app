import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CouponFactory, UserFactory } from 'Database/factories'

test.group('API [coupons.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('only authenticated user can see the coupon resource.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.get(route('api.coupons.show', { id: coupon.id })).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      code: coupon.code,
    })
  }).tags(['@coupons', '@coupons.show'])

  test('only existing coupon is accessible via id or request param.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.get(route('api.coupons.show', { id: 15 })).guard('api')
      // @ts-ignore
      .loginAs(user)

    response.assertStatus(400)
  }).tags(['@coupons', '@coupons.show'])

  test('un-authenticated user can not see the coupon resource.', async ({ client, route }) => {
    const coupon = await CouponFactory.create()

    const response = await client.get(route('api.coupons.show', { id: coupon.id }))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@coupons', '@coupons.show'])
})
