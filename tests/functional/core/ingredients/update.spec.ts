import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const response = await client.put(route('core.ingredients.update', ingredient))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.update'])

  test('it do not allow access to none management user.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ingredient = await IngredientFactory.create()

    const response = await client.put(route('core.ingredients.update', ingredient)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.update'])

  test('it allows a management user to update ingredient.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.ingredients.update', ingredient))
      .guard('api').loginAs(user)
      .fields({
        name: 'Demo Name',
        description: ingredient.description,
        price: ingredient.price,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
        minQuantity: ingredient.minQuantity,
        maxQuantity: ingredient.maxQuantity,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: 'Demo Name', description: ingredient.description})
  }).tags(['@core', '@core.ingredients.update'])
})
