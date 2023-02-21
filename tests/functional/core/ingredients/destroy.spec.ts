import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow the deletion of ingredient to a guest user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const response = await client.get(route('core.ingredients.destroy', ingredient))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.destroy'])

  test('it do not allow the deletion of ingredient to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ingredient = await IngredientFactory.create()

    const response = await client.get(route('core.ingredients.destroy', ingredient)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.destroy'])

  test('it allows the deletion of ingredient to a management user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.ingredients.destroy', ingredient)).guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.ingredients.destroy'])

  test('it throw error when the ingredient id does not exists.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.ingredients.destroy', {id: 50})).guard('api').loginAs(user)

    response.assertStatus(404)
  }).tags(['@core', '@core.ingredients.destroy'])
})
