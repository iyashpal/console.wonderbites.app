import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const response = await client.get(route('core.ingredients.show', ingredient))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.show'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ingredient = await IngredientFactory.create()
    const response = await client.get(route('core.ingredients.show', ingredient))
      .guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.show'])

  test('it allows access to a management user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.ingredients.show', ingredient))
      .guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({ id: ingredient.id, name: ingredient.name})
  }).tags(['@core', '@core.ingredients.show'])
})
