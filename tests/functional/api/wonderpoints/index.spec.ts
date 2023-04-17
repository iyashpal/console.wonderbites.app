import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, WonderpointFactory } from 'Database/factories'

test.group('API [wonderpoints.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Guest users cannot access the wonderpoints list.', async ({ client, route }) => {
    const response = await client.get(route('api.wonderpoints.index'))

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@api', '@api.wonderpoints', '@api.wonderpoints.index'])

  test('Authenticated users can access their wonderpoints earnings.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const wonderpoints = await WonderpointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonderpoints.index')).guard('api')
      .loginAs(user)

    // response.dumpBody()

    response.assertBodyContains({
      meta: {
        total: 2,
        per_page: 10,
        current_page: 1,
      },
      data: [
        { id: wonderpoints[0].id, user_id: user.id, action: 'earn' },
        { id: wonderpoints[1].id, user_id: user.id, action: 'redeem' },
      ],
    })
  }).tags(['@api', '@api.wonderpoints', '@api.wonderpoints.index'])

  test('Users can list only earned wonderpoints', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    await WonderpointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonderpoints.index', {}, { qs: { type: 'earned' } })).guard('api')
      .loginAs(user)

    assert.strictEqual(response.body().data.length, 1)
  }).tags(['@api', '@api.wonderpoints', '@api.wonderpoints.index'])

  test('Users can list only redeemed wonderpoints', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    await WonderpointFactory.merge([
      { userId: user.id, points: 50, action: 'earn' },
      { userId: user.id, points: 50, action: 'redeem' },
    ]).createMany(2)

    const response = await client.get(route('api.wonderpoints.index', {}, { qs: { type: 'redeemed' } })).guard('api')
      .loginAs(user)

    assert.strictEqual(response.body().data.length, 1)
  }).tags(['@api', '@api.wonderpoints', '@api.wonderpoints.index'])
})
