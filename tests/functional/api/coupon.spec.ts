import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Api coupons', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('apply coupon', async ({ client, route }) => {
    const user = await UserFactory.create()

    await client.post(route('api.coupons.apply')).loginAs(user)
  })
})
