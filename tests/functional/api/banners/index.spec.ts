import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { BannerFactory, UserFactory } from 'Database/factories'

test.group('Api [banners.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can access the banners.', async ({ client, route }) => {
    const banner = await BannerFactory.with('user').create()
    const $response = await client.get(route('api.banners.index', {}, { qs: {with: ['banners.user']} }))
    $response.assertBodyContains([{id: banner.id}])
  }).tags(['@api', '@api.banners', '@api.banners.index'])

  test('it allows access to guest users to see the banners list .', async ({ client, route }) => {
    const banner = await BannerFactory.with('user').create()
    const $response = await client.get(route('api.banners.index', {}, { qs: {with: ['banners.user']} }))
    $response.assertBodyContains([{id: banner.id}])
  }).tags(['@api', '@api.banners', '@api.banners.index'])

  test('it allows access to logged-in users to see the banners list .', async ({ client, route }) => {
    const user = await UserFactory.create()
    const banner = await BannerFactory.with('user').create()
    const $response = await client.get(route('api.banners.index', {}, { qs: { with: ['banners.user'] } }))
      .guard('api').loginAs(user)
    $response.assertBodyContains([{id: banner.id}])
  }).tags(['@api', '@api.banners', '@api.banners.index'])
})
