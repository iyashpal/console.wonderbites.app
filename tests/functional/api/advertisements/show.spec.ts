import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdvertisementFactory from 'Database/factories/AdvertisementFactory'

test.group('API [advertisements.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can access an advertisement.', async ({ client, route }) => {
    const advertisement = await AdvertisementFactory.create()

    const $response = await client.get(route('api.advertisements.show', { id: advertisement.id }))

    $response.assertStatus(200)

    $response.assertBodyContains({ id: advertisement.id })
  }).tags(['@api', '@api.advertisements', '@api.advertisements.show'])

  test('it can list advertisement with user.', async ({ client, route }) => {
    const advertisement = await AdvertisementFactory.with('user').create()

    const qs = { with: ['advertisement.user'] }

    const $response = await client.get(route('api.advertisements.show', { id: advertisement.id }, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains({
      id: advertisement.id,
      title: advertisement.title,
      user: {
        id: advertisement.user.id,
      },
    })
  }).tags(['@api', '@api.advertisements', '@api.advertisements.show'])
})
