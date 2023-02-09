import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core ingredients store', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow a guest user to store ingredient.', async ({client, route}) => {
    const response = await client.post(route('core.ingredients.store'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.store'])

  test('it do not allow a none management user to store ingredient.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.ingredients.store')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.store'])

  test('it allows a management user to store ingredient.', async ({client, route}) => {
    const ingredient = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.ingredients.store'))
      .guard('api').loginAs(user)
      .fields({
        name: ingredient.name,
        description: ingredient.description,
        price: ingredient.price,
        unit: ingredient.unit,
        quantity: ingredient.quantity,
        minQuantity: ingredient.minQuantity,
        maxQuantity: ingredient.maxQuantity,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: ingredient.name, description: ingredient.description})
  }).tags(['@core', '@core.ingredients.store'])
})
