import { test } from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

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
    response.assertBodyContains({
      data: [],
      meta: {current_page: 1},
    })
  }).tags(['@core', '@core.banners.index'])
})
