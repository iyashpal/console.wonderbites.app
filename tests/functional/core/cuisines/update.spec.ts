import {DateTime} from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {CuisineFactory, UserFactory} from 'Database/factories'

test.group('Core cuisines update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code to a guest user.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const response = await client.put(route('core.cuisines.update', cuisine))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.update'])

  test('it throws 401 error code to a user who has no role assigned.', async ({client, route}) => {
    const user = await UserFactory.create()
    const cuisine = await CuisineFactory.create()

    const response = await client.put(route('core.cuisines.update', cuisine)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.cuisines.update'])

  test('it do not throw any 401 error code to a user who has a role assigned.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: 'Demo Name',
        description: cuisine.description,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: 'Demo Name', description: cuisine.description})
  }).tags(['@core', '@core.cuisines.update'])

  test('it throws 404 error if the cuisine is trashed.', async ({client, route}) => {
    const cuisine = await CuisineFactory.merge({deletedAt: DateTime.now()}).create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: 'Demo Name',
        description: cuisine.description,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.update'])

  test('it throws 404 error if the cuisine does not exists.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', {id: 50}))
      .guard('api').loginAs(user)
      .fields({
        name: 'Demo Name',
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(404)
  }).tags(['@core', '@core.cuisines.update'])

  test('it throws validation error if the name is missing or empty.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()

    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: '',
        description: cuisine.description,
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(422)

    response.assertBodyContains({errors: { name: 'required validation failed'}})
  }).tags(['@core', '@core.cuisines.update'])

  test('it throws validation error if the status is missing or empty.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()

    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: 'Demo Name',
        description: cuisine.description,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(422)

    response.assertBodyContains({errors: { status: 'required validation failed'}})
  }).tags(['@core', '@core.cuisines.update'])

  test('it do not throw validation error if the description is missing or empty.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()

    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: 'testing',
        description: '',
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: 'testing'})
  }).tags(['@core', '@core.cuisines.update'])

  test('it updates the modified data after passing all validation checks.', async ({client, route}) => {
    const cuisine = await CuisineFactory.create()

    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.cuisines.update', cuisine))
      .guard('api').loginAs(user)
      .fields({
        name: 'testing',
        description: 'description',
        status: 1,
      })
      .file('thumbnail', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)

    response.assertBodyContains({name: 'testing'})
  }).tags(['@core', '@core.cuisines.update'])
})
