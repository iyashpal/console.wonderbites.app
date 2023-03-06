import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, CuisineFactory, UserFactory } from 'Database/factories'

test.group('Core [cuisines.categories]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()

    return () => Database.rollbackGlobalTransaction()
  })


  test('it do not allow access to a guest user.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()

    const response = await client.post(route('core.cuisines.categories', cuisine))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.cuisines.categories'])

  test('it do not allow access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cuisine = await CuisineFactory.create()

    const response = await client.post(route('core.cuisines.categories', cuisine)).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.cuisines.categories'])

  test('it throws 404 error if the cuisine is trashed.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.merge({ deletedAt: DateTime.now() }).create()

    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.categories', cuisine)).guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.categories'])

  test('it throws 404 error if the cuisine does not exists.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.categories', { id: 50 })).guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.categories'])

  test('it attach the categories to cuisine.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()

    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()

    const response = await client.post(route('core.cuisines.categories', cuisine))
      .guard('api').loginAs(user).json({ action: 'attach', categories: [category.id] })
    
    response.assertStatus(200)

    response.assertBodyContains({ cuisine: { id: cuisine.id, categories: [{ id: category.id }] } })
  }).tags(['@core', '@core.cuisines.categories'])

  test('it detach the categories from cuisine.', async ({ client, route }) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()
    const cuisine = await CuisineFactory.merge({ userId: user.id }).create()

    await cuisine.related('categories').attach([category.id])

    const response = await client.post(route('core.cuisines.categories', cuisine))
      .guard('api').loginAs(user).json({ action: 'detach', categories: [category.id] })

    response.assertStatus(200)
    
    response.assertBodyContains({ cuisine: { id: cuisine.id } })
  }).tags(['@core', '@core.cuisines.categories'])
})
