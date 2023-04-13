import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {BannerFactory, UserFactory} from 'Database/factories'

test.group('Core [banners.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const banner = await BannerFactory.create()
    const response = await client.delete(route('core.banners.destroy', banner))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.destroy'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const banner = await BannerFactory.create()
    const user = await UserFactory.create()
    const response = await client.delete(route('core.banners.destroy', banner)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners', '@core.banners.destroy'])

  test('it reads 200 status code and deletes record when user is authenticated with valid role.')
    .run(async ({client, route}) => {
      const banner = await BannerFactory.create()
      const user = await UserFactory.with('role').create()
      const response = await client.delete(route('core.banners.destroy', banner)).guard('api').loginAs(user)

      response.assertStatus(200)
      response.assertBodyContains({success: true})
    }).tags(['@core', '@core.banners', '@core.banners.destroy'])
})
