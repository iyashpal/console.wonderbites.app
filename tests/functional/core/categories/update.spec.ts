import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core [categories.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code to a guest user.', async ({client, route}) => {
    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 401 error code to a none management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 200 status code to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        description: category.description,
        type: category.type,
        parent: category.parent,
        status: category.status,
      })

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.update'])

  test('it throws 422 validation error when name is missing or empty.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: '',
        type: category.type,
        parent: category.parent,
        status: category.status,
      })

    response.assertStatus(422)
    response.assertBodyContains({errors: {name: 'required validation failed'}})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 422 validation error when type is missing or empty.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        type: '',
        parent: category.parent,
        status: category.status,
      })

    response.assertStatus(422)
    response.assertBodyContains({errors: {type: 'required validation failed'}})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 422 validation error when parent id is invalid.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        type: category.type,
        parent: 0,
        status: category.status,
      })

    response.assertStatus(422)
    response.assertBodyContains({errors: {parent: 'exists validation failure'}})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 422 validation error when status is missing or empty.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        type: category.type,
        parent: category.parent,
      })

    response.assertStatus(422)
    response.assertBodyContains({errors: {status: 'required validation failed'}})
  }).tags(['@core', '@core.categories.update'])

  test('it throws 422 validation error when status is missing or empty.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        type: category.type,
        parent: category.parent,
      })

    response.assertStatus(422)
    response.assertBodyContains({errors: {status: 'required validation failed'}})
  }).tags(['@core', '@core.categories.update'])

  test('it passes the validation when parent is null.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: category.name,
        type: category.type,
        parent: null,
        status: category.status,
      })

    response.assertStatus(200)
  }).tags(['@core', '@core.categories.update'])

  test('it updates the category data after passing the validation rules.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const category = await CategoryFactory.create()
    const response = await client.put(route('core.categories.update', category))
      .guard('api').loginAs(user).json({
        name: 'Updated Category',
        type: category.type,
        parent: null,
        status: category.status,
      })

    response.assertStatus(200)

    response.assertBodyContains({name: 'Updated Category'})
  }).tags(['@core', '@core.categories.update'])
})
