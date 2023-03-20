import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {CategoryFactory, IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [ingredients.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code when the user is not logged in.', async ({client, route}) => {
    const response = await client.post(route('core.ingredients.store'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.store'])

  test('it thorws 401 error code when the user don\'t have any role assigned.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.ingredients.store')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.ingredients.store'])

  test('it stores ingredient with 200 status code when user has a valid role assigned.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const ingredient = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.ingredients.store'))
      .guard('api').loginAs(user)
      .fields({
        name: ingredient.name,
        categoryId: category.id,
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
