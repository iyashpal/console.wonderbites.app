import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CouponFactory, UserFactory } from 'Database/factories'

test.group('API [coupons.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('only authenticated user can update a coupon.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.put(route('api.coupons.update', { id: coupon.id })).guard('api')

      .loginAs(user)
      .json({
        ...(await coupon.toObject()),
        title: 'Updated Title for tests.',
        description: 'Updated Description for tests.',
        code: 'UPDATED',
        startedAt: coupon.started_at.toFormat('yyyy-MM-dd HH:mm:ss'),
        expiredAt: coupon.expired_at.toFormat('yyyy-MM-dd HH:mm:ss'),
      })

    response.assertStatus(200)
    response.assertBodyContains({
      title: 'Updated Title for tests.',
      description: 'Updated Description for tests.',
      code: 'UPDATED',
    })
  }).tags(['@coupons', '@coupons.update'])

  test('un-authenticated user can not update a coupon.', async ({ client, route }) => {
    const coupon = await CouponFactory.create()

    const response = await client.put(route('api.coupons.update', { id: coupon.id }))
      .json({ title: 'Updated Title for tests.', description: 'Updated Description for tests.', code: 'UPDATED' })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@coupons', '@coupons.update'])

  test('only existing coupons can be updated.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.put(route('api.coupons.update', { id: 15 })).guard('api')

      .loginAs(user)

    response.assertStatus(400)
  }).tags(['@coupons', '@coupons.update'])
})
