import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CategoryFactory, CuisineFactory, UserFactory } from 'Database/factories'

test.group('API [cuisines.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It can allow public users to access the cuisine.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()

    const $response = await client.get(route('api.cuisines.show', cuisine))

    $response.assertStatus(200)

    $response.assertBodyContains({
      id: cuisine.id,
      name: cuisine.name,
      description: cuisine.description,
    })
  })

  test('It can allow authenticated users to access the cuisine.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const cuisine = await CuisineFactory.create()

    const $response = await client.get(route('api.cuisines.show', cuisine))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      id: cuisine.id,
      name: cuisine.name,
      description: cuisine.description,
    })
  })

  test('it can list all cuisines and categories under all cuisines.', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()
    const categories = await CategoryFactory.createMany(15)

    await cuisine.related('categories').attach(categories.map(({ id }) => id))

    const qs = { with: ['cuisine.categories'] }

    const $response = await client.get(route('api.cuisines.show', cuisine, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains({
      id: cuisine.id,
      name: cuisine.name,
      description: cuisine.description,
      status: cuisine.status,
      categories: categories.map(({ id, name }) => ({ id, name })),
    })
  }).tags(['@cuisines', '@cuisines.index'])
})
