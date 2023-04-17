import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import AdvertisementFactory from 'Database/factories/AdvertisementFactory'

test.group('API [advertisements.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can access all advertisements.', async ({ client, route }) => {
    const $response = await client.get(route('api.advertisements.index'))

    $response.assertStatus(200)

    $response.assertBodyContains([])
  }).tags(['@api', '@api.advertisements', '@api.advertisements.index'])

  test('it can list all advertisements.', async ({ client, route, assert }) => {
    const advertisement = await AdvertisementFactory.merge({ options: { location: 'home.banner' } }).create()
    const $response = await client.get(route('api.advertisements.index'))

    $response.assertStatus(200)

    $response.assertBodyContains([{ id: advertisement.id, title: advertisement.title }])

    assert.equal($response.body().length, 1)
  }).tags(['@api', '@api.advertisements', '@api.advertisements.index'])

  test('it can list all advertisements with user.', async ({ client, route, assert }) => {
    const advertisements = await AdvertisementFactory.with('user').createMany(4)

    const qs = { with: ['advertisements.user'] }

    const $response = await client.get(route('api.advertisements.index', {}, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains(
      advertisements.map(advertisement => ({
        id: advertisement.id,
        title: advertisement.title,
        user: {
          id: advertisement.user.id,
        },
      }))
    )

    assert.equal($response.body().length, 4)
  }).tags(['@api', '@api.advertisements', '@api.advertisements.index'])

  test('it can list advertisements with filters - "{$self}"')
    .with(['home', 'meal', 'footer', 'demo', 'global'])
    .run(async ({ client, route, assert }, location) => {
      const mergeOptions = [
        { options: {location: 'home'} },
        { options: {location: 'home'} },
        { options: {location: 'meal'} },
        { options: {location: 'footer'} },
        { options: {location: 'demo'} },
        { options: {location: 'global'} },
      ]

      await AdvertisementFactory.merge(mergeOptions).createMany(6)

      const $response = await client.get(route('api.advertisements.index', {}, { qs: {location} }))

      $response.assertStatus(200)

      assert.equal($response.body().length, mergeOptions.filter(({options}) => options.location === location).length)
    }).tags(['@api', '@api.advertisements', '@api.advertisements.index'])
})
