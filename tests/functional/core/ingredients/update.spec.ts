import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 status code when the user is not logged in.', async ({client, route}) => {
    const ingredient = await IngredientFactory.create()
    const response = await client.put(route('core.ingredients.update', ingredient))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.update'])

  test('it throws 401 status code when the user is logged in but missing the role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ingredient = await IngredientFactory.create()

    const response = await client.put(route('core.ingredients.update', ingredient)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.update'])

  test('it updates product with 200 status code when user owns a role.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const ingredient = await IngredientFactory.with('categories', 1).create()

    const [category] = ingredient.categories

    const response = await client.put(route('core.ingredients.update', ingredient))
      .guard('api').loginAs(user)
      .fields({
        categoryId: category.id,
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
