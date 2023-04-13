import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {BannerFactory, UserFactory} from 'Database/factories'

test.group('Core [banners.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const banner = await BannerFactory.create()
    const response = await client.get(route('core.banners.show', banner))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.show'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const banner = await BannerFactory.create()
    const response = await client.get(route('core.banners.show', banner)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.show'])

  test('it reads 200 status code and see the benner id when user is authenticated with valid role.')
    .run(async ({client, route}) => {
      const banner = await BannerFactory.create()
      const user = await UserFactory.with('role').create()
      const response = await client.get(route('core.banners.show', banner)).guard('api').loginAs(user)

      response.assertStatus(200)
      response.assertBodyContains({banner: {id: banner.id}})
    }).tags(['@core', '@core.banners', '@core.banners.show'])
})
