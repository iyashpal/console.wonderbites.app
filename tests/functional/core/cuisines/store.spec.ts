import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {IngredientFactory, UserFactory} from 'Database/factories'

test.group('Core [cuisines.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow a guest user to store cuisine.', async ({client, route}) => {
    const response = await client.post(route('core.cuisines.store'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.store'])

  test('it do not allow a none management user to store a cuisine.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.cuisines.store')).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.store'])

  test('it throws a validation error if name is missing.', async ({client, route}) => {
    const cuisine = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.store'))
      .guard('api').loginAs(user)
      .fields({
        description: cuisine.description,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(422)

    response.assertBodyContains({errors: {name: 'required validation failed'}})
  }).tags(['@core', '@core.cuisines.store'])

  test('it do not throw a validation error if description is missing.', async ({client, route}) => {
    const cuisine = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.store'))
      .guard('api').loginAs(user)
      .fields({
        name: cuisine.name,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: cuisine.name})
  }).tags(['@core', '@core.cuisines.store'])

  test('it throws a validation error if status is missing.', async ({client, route}) => {
    const cuisine = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.store'))
      .guard('api').loginAs(user)
      .fields({
        name: cuisine.name,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(422)

    response.assertBodyContains({errors: {status: 'required validation failed'}})
  }).tags(['@core', '@core.cuisines.store'])

  test('it creates record if there are no validation errors remaining.', async ({client, route}) => {
    const cuisine = await IngredientFactory.make()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.cuisines.store'))
      .guard('api').loginAs(user)
      .fields({
        name: cuisine.name,
        description: cuisine.description,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: cuisine.name, description: cuisine.description})
  }).tags(['@core', '@core.cuisines.store'])
})
