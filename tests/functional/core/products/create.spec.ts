import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

test.group('Core [products.create]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to a guest user.', async ({ client, route }) => {
    const response = await client.post(route('core.products.store'))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.create'])

  test('it do not allow access to a non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('core.products.store')).guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.create'])

  test('it allow access to a management user.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store')).guard('api').loginAs(user)

    response.assertStatus(422)

  }).tags(['@core', '@core.products.create'])

  test('it requires a name to create new product.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user)

    response.assertStatus(422)

    response.assertBodyContains({ errors: { name: 'required validation failed' } })
  }).tags(['@core', '@core.products.create'])

  test('it requires a ID/SKU to create new product.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo' })

    response.assertStatus(422)

    response.assertBodyContains({ errors: { sku: 'required validation failed' } })
  }).tags(['@core', '@core.products.create'])

  test('it requires price to create new product.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684' })

    response.assertStatus(422)

    response.assertBodyContains({ errors: { price: 'required validation failed' } })
  }).tags(['@core', '@core.products.create'])

  test('it requires description to create new product.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684', price: 500 })

    response.assertStatus(422)

    response.assertBodyContains({ errors: { description: 'required validation failed' } })
  }).tags(['@core', '@core.products.create'])


  test('it requires a category to create new product.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684', price: 500, description: 'This is demo...' })

    response.assertStatus(422)

    response.assertBodyContains({ errors: { categoryId: 'required validation failed' } })
  }).tags(['@core', '@core.products.create'])

  test('it can create new product.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684', price: 500, description: 'this is demo description...', categoryId: 1 })

    response.assertStatus(200)

    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku'])
  }).tags(['@core', '@core.products.create'])

  test('it can draft new product.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684', price: 500, description: 'this is demo description...', categoryId: 1 })

    response.assertStatus(200)

    assert.notProperty(response.body(), 'publishedAt')
    
    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku'])
  }).tags(['@core', '@core.products.create'])

  test('it can publish new product.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('role').create()

    const response = await client.post(route('core.products.store'))
      .guard('api').loginAs(user).json({ name: 'Demo', sku: 'P5684', price: 500, description: 'this is demo description...', categoryId: 1, publishedAt: DateTime.now() })

    response.assertStatus(200)

    assert.properties(response.body(), ['id', 'name', 'description', 'price', 'sku', 'publishedAt'])
  }).tags(['@core', '@core.products.create'])
})
