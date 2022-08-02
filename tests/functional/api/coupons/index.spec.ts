import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CouponFactory, UserFactory } from 'Database/factories'

test.group('API [coupons.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('only logged in user can list the coupons', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const coupons = await CouponFactory.createMany(10)

    const response = await client.get(route('api.coupons.index')).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains(coupons.map(({ id }) => ({ id })))
    assert.equal(response.body().length, coupons.length)
  }).tags(['@coupons', '@coupons.index'])

  test('guest users can not list the coupons', async ({ client, route }) => {
    const response = await client.get(route('api.coupons.index'))

    response.assertStatus(401)
  }).tags(['@coupons', '@coupons.index'])
})
