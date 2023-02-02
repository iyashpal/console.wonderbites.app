import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'
import { DateTime } from 'luxon'

test.group('Core products update', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to guest user.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const response = await client.put(route('core.products.update', product))

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.update'])

  test('it do not allow access to non-management user.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.products.update'])

  test('it allow access to a management user.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), categoryId: 1 })

    response.assertStatus(200)
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product name.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), name: '' })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['name'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product description.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), description: '' })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['description'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product sku.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), sku: '' })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['sku'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product category.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json(product.toObject())

    response.assertStatus(422)

    assert.properties(response.body().errors, ['categoryId'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product price.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), price: '' })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['price'])
  }).tags(['@core', '@core.products.update'])

  test('it allow user to mark product as unpublished.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), publishedAt: null, categoryId: 1 })

    response.assertStatus(200)

    response.assertBodyContains({ publishedAt: null })
  }).tags(['@core', '@core.products.update'])

  test('it allow user to mark product as published.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({ ...product.toObject(), publishedAt: DateTime.now(), categoryId: 1 })

    response.assertStatus(200)

    assert.notEmpty(response.body().publishedAt)
  }).tags(['@core', '@core.products.update'])

  test('it allows user to change product information by passing the validation rules.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({
        ...product.toObject(),
        categoryId: 1,
        name: 'Demo Updated',
        description: 'Demo description updated...',
        publishedAt: DateTime.now(),
      })

    response.assertStatus(200)

    response.assertBodyContains({ id: product.id, name: 'Demo Updated', description:  'Demo description updated...'})
  }).tags(['@core', '@core.products.update'])


})
