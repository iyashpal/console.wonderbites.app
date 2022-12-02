import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('API [advertisements.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can access all advertisements.', async ({ client, route, assert }) => {
    const $response = await client.get(route('api.advertisements.index'))

    $response.assertStatus(200)
  }).tags(['@advertisements', '@advertisements.index'])
})
