import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code to a guest user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const response = await client.get(route('core.ingredients.show', ingredient))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.show'])

  test('it throws 401 error code when user has no role assigned.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ingredient = await IngredientFactory.create()
    const response = await client.get(route('core.ingredients.show', ingredient))
      .guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.show'])

  test('it throws 200 status code when user has a role assigned.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.ingredients.show', ingredient))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ingredient: {id: ingredient.id, name: ingredient.name}})
  }).tags(['@core', '@core.ingredients.show'])
})
