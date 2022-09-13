import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, CuisineFactory, UserFactory } from 'Database/factories'

test.group('API [cuisines.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access to public users.', async ({ client, route }) => {
    const $response = await client.get(route('api.cuisines.index'))

    $response.assertStatus(200)
  }).tags(['@cuisines', '@cuisines.index'])

  test('it can allow access to authenticated users.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const $response = await client.get(route('api.cuisines.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertStatus(200)
  }).tags(['@cuisines', '@cuisines.index'])

  test('it can list all cuisines.', async ({ client, route }) => {
    const cuisines = await CuisineFactory.createMany(10)

    const $response = await client.get(route('api.cuisines.index'))

    $response.assertStatus(200)

    $response.assertBodyContains(
      cuisines.map(({ id, name, description, status }) => ({ id, name, description, status }))
    )
  }).tags(['@cuisines', '@cuisines.index'])

  test('it can list all cuisines and categories under all cuisines.', async ({ client, route }) => {
    const cuisines = await CuisineFactory.createMany(10)
    const categories = await CategoryFactory.createMany(15)

    cuisines.forEach(async (cuisine) => await cuisine.related('categories').attach(categories.map(({ id }) => id)))

    const qs = { with: ['cuisines.categories'] }

    const $response = await client.get(route('api.cuisines.index', {}, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains(
      cuisines.map(({ id, name, description, status }) => ({
        id, name, description, status,
        categories: categories.map(({ id, name }) => ({ id, name })),
      }))
    )
  }).tags(['@cuisines', '@cuisines.index'])

  test('it can paginate cuisines.', async ({ client, route }) => {
    const cuisines = await CuisineFactory.createMany(20)

    const qs = { limit: 10 }

    const $response = await client.get(route('api.cuisines.index', {}, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains(
      cuisines.map(({ id, name, description, status }) => ({ id, name, description, status }))
    )
  }).tags(['@cuisines', '@cuisines.index'])
})
