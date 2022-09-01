import {test} from '@japa/runner'
import {ReviewFactory, UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [products.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access to all users.', async ({client, route}) => {
    const request = await client.get(route('api.reviews.index'))

    request.assertStatus(200)
  }).tags(['@reviews', '@reviews.index'])

  test('it can list the reviews', async ({client, route}) => {
    const user = await UserFactory.create()
    await ReviewFactory.merge({userId: user.id}).apply('typeProduct').createMany(1)

    const request = await client.get(route('api.reviews.index'))

    request.assertStatus(200)

    request.dumpBody()

    // request.assertBodyContains({
    //   data: [],
    // })
  }).tags(['@reviews', '@reviews.index'])
})
