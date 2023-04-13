import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {BannerFactory, UserFactory} from 'Database/factories'

test.group('Core [banners.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is unauthenticated.', async ({client, route}) => {
    const response = await client.get(route('core.banners.index'))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners.index'])

  test('it reads 401 status code when user is authenticated with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.get(route('core.banners.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.banners.index'])

  test('it reads 200 status code when user is authenticated with valid role.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.banners.index')).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({meta: {current_page: 1, total: 0, first_page: 1, last_page: 1}})
  }).tags(['@core', '@core.banners.index'])

  test('it can visit to page no. {$i}')
    .with([
      {page: 1, limit: 10}, {page: 2, limit: 10}, {page: 3, limit: 10}, {page: 4, limit: 10}, {page: 5, limit: 10},
    ])
    .run(async ({client, route}, {page, limit}) => {
      const banners = await BannerFactory.createMany(50)
      const user = await UserFactory.with('role').create()
      // Sort banners in descending order
      banners.sort((a, b) => b.id - a.id)

      const currentPage = banners.slice((page * limit) - limit, page * limit).map(({id}) => id)
      const response = await client.get(route('core.banners.index', {}, {qs: {page, limit}})).guard('api').loginAs(user)

      response.assertStatus(200)
      response.assertBodyContains({
        data: currentPage.map(id => ({id})),
        meta: {current_page: page, total: 50, first_page: 1, last_page: 5},
      })
    }).tags(['@core', '@core.banners', '@core.banners.index'])
})
