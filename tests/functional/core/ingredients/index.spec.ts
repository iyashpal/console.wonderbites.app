import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.get(route('core.ingredients.index'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.index'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.get(route('core.ingredients.index')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.index'])

  test('it allows access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.ingredients.index')).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.ingredients.index'])

  test('it reads paginated list of ingredients - page: {$i}')
    .with([1, 2])
    .run(async ({client, route}, page) => {
      const user = await UserFactory.with('role').create()
      const ingredients = await IngredientFactory.createMany(20)

      const response = await client.get(route('core.ingredients.index', {}, {qs: {page}})).guard('api').loginAs(user)

      response.assertStatus(200)

      response.assertBodyContains({
        meta: {total: 20, current_page: page, last_page: 2, first_page: 1},
        data: ingredients
          .filter((ingredient, index) => (page === 1 ? index < 10 : index >= 10))
          .map(ingredient => ({id: ingredient.id, name: ingredient.name})),
      })
    }).tags(['@core', '@core.ingredients.index'])

  test('it do not list deleted ingredients', async ({client, route}) => {
    await IngredientFactory.createMany(6)
    await IngredientFactory.merge({deletedAt: DateTime.now()}).createMany(4)

    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.ingredients.index'))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({meta: {total: 6}})
  }).tags(['@core', '@core.ingredients.index'])
})
