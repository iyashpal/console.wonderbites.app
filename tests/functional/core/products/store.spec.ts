import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import {CategoryFactory, UserFactory} from 'Database/factories'

test.group('Core [products.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({client, route}) => {
    const response = await client.post(route('core.products.store'))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it do not allow access to a non-management user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.products.store')).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it allow access to a management user.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store')).guard('api').loginAs(user)

    response.assertStatus(422)
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it requires a name to create new product.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user)

    response.assertStatus(422)

    response.assertBodyContains({errors: {name: 'required validation failed'}})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it requires a ID/SKU to create new product.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({name: 'Demo'})

    response.assertStatus(422)

    response.assertBodyContains({errors: {sku: 'required validation failed'}})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it requires price to create new product.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({name: 'Demo', sku: 'P5684'})

    response.assertStatus(422)

    response.assertBodyContains({errors: {price: 'required validation failed'}})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it requires description to create new product.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({name: 'Demo', sku: 'P5684', price: 500})

    response.assertStatus(422)

    response.assertBodyContains({errors: {description: 'required validation failed'}})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it requires a category to create new product.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({name: 'Demo', sku: 'P5684', price: 500, description: 'This is demo...'})

    response.assertStatus(422)

    response.assertBodyContains({errors: {categoryId: 'required validation failed'}})
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it can create new product.', async ({client, route, assert}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user)
      .file('thumbnail', Application.publicPath('/images/logo.svg')).fields({
        name: 'Demo', sku: 'P5684', price: 500, description: 'this is demo description...', categoryId: category.id,
        isCustomizable: false,
      })

    response.assertStatus(200)

    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku'])
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it can draft new product.', async ({client, route, assert}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user)
      .file('thumbnail', Application.publicPath('/images/logo.svg'))
      .fields({
        name: 'Demo', sku: 'P5684', price: 500, description: 'this is demo description...', categoryId: category.id,
        isCustomizable: false,
      })

    response.assertStatus(200)

    assert.notProperty(response.body(), 'publishedAt')

    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku'])
  }).tags(['@core', '@core.products', '@core.products.store'])

  test('it can publish new product.', async ({client, route, assert}) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user)
      .file('thumbnail', Application.publicPath('/images/logo.svg'))
      .fields({
        name: 'Demo',
        sku: 'P5684',
        price: 500,
        description: 'this is demo description...',
        categoryId: category.id,
        publishedAt: DateTime.now().toString(),
        isCustomizable: false,
      })

    response.assertStatus(200)

    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku', 'published_at'])
  }).tags(['@core', '@core.products', '@core.products.store'])
})
