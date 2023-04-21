import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, WonderPointFactory } from 'Database/factories'

test.group('API [wonder-points.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users cannot access the wonder points list.', async ({ client, route }) => {
    const response = await client.get(route('api.wonder_points.index'))

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.index'])

  test('Authenticated users can access their wonder points earnings.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const wonderPoints = await WonderPointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonder_points.index')).guard('api')
      .loginAs(user)

    // response.dumpBody()

    response.assertBodyContains({
      meta: {
        total: 2,
        per_page: 10,
        current_page: 1,
      },
      data: [
        { id: wonderPoints[0].id, user_id: user.id, action: 'earn' },
        { id: wonderPoints[1].id, user_id: user.id, action: 'redeem' },
      ],
    })
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.index'])

  test('Users can list only earned wonder points', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    await WonderPointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonder_points.index', {}, { qs: { type: 'earned' } })).guard('api')
      .loginAs(user)

    assert.strictEqual(response.body().data.length, 1)
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.index'])

  test('Users can list only redeemed wonder points', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    await WonderPointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonder_points.index', {}, { qs: { type: 'redeemed' } })).guard('api')
      .loginAs(user)

    assert.strictEqual(response.body().data.length, 1)
  }).tags(['@api', '@api.wonder-points', '@api.wonder-points.index'])
})
