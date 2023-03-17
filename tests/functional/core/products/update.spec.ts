import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, ProductFactory, UserFactory} from 'Database/factories'

test.group('Core [products.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 error code when guest user try to access.', async ({client, route}) => {
    const product = await ProductFactory.create()

    const response = await client.put(route('core.products.update', product))

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products.update'])

  test('it throws 401 error code when user don\'t have role assigned.', async ({client, route}) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user)

    response.assertStatus(401)

    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products.update'])

  test('it throws 200 status code when user has role assigned.', async ({client, route}) => {
    const {
      id, name, description, publishedAt, price, sku, categories,
    } = await ProductFactory.with('categories', 1).create()
    const user = await UserFactory.with('role').create()

    const [category] = categories

    const response = await client.put(route('core.products.update', {id}))
      .guard('api').loginAs(user).json({
        categoryId: category.id, name, description, publishedAt, price, sku,
      })

    response.assertStatus(200)
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product name.', async ({client, route, assert}) => {
    const product = await ProductFactory.with('categories', 1).create()
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({
        categoryId: category.id,
        name: '',
        publishedAt: null,
        price: 50,
        sku: 'SKU563',
        description: 'asdlkfj',
      })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['name'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product description.', async ({client, route, assert}) => {
    const product = await ProductFactory.with('categories', 1).create()
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({
        categoryId: category.id,
        name: 'Product Name',
        publishedAt: null,
        price: 50,
        sku: 'SKU563',
        description: '',
      })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['description'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product sku.', async ({client, route, assert}) => {
    const product = await ProductFactory.create()
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({
        categoryId: category.id,
        name: 'Product Name',
        description: 'Product descritpion...',
        publishedAt: null,
        price: 50,
        sku: '',
      })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['sku'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product category.', async ({client, route, assert}) => {
    const {
      id, name, description, publishedAt, price, sku,
    } = await ProductFactory.with('categories', 1).create()

    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', {id}))
      .guard('api').loginAs(user).json({
        name, description, sku, publishedAt, price,
      })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['categoryId'])
  }).tags(['@core', '@core.products.update'])

  test('it do not allow user to remove product price.', async ({client, route, assert}) => {
    const product = await ProductFactory.with('categories', 1).create()
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.put(route('core.products.update', product))
      .guard('api').loginAs(user).json({
        categoryId: category.id,
        name: 'Product Name',
        description: 'Product descritpion...',
        sku: 'SKU563',
        publishedAt: null,
        price: '',
      })

    response.assertStatus(422)

    assert.properties(response.body().errors, ['price'])
  }).tags(['@core', '@core.products.update'])

  test('it allow user to mark product as unpublished.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const {
      id, name, description, price, sku, categories,
    } = await ProductFactory.with('categories', 1).create()

    const [category] = categories

    const response = await client.put(route('core.products.update', {id}))
      .guard('api').loginAs(user)
      .json({categoryId: category.id, name, price, description, sku, publishedAt: null})

    response.assertStatus(200)
    response.assertBodyContains({published_at: null})
  }).tags(['@core', '@core.products.update'])

  test('it allow user to mark product as published.', async ({client, route, assert}) => {
    const user = await UserFactory.with('role').create()
    const {
      id, name, description, price, sku, categories,
    } = await ProductFactory.with('categories', 1).create()
    const [category] = categories

    const response = await client.put(route('core.products.update', {id}))
      .guard('api').loginAs(user)
      .json({categoryId: category.id, name, price, description, sku, publishedAt: DateTime.now()})

    response.assertStatus(200)

    assert.notEmpty(response.body().published_at)
  }).tags(['@core', '@core.products.update'])

  test('it allows user to change product information by passing the validation rules.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const {id, categories} = await ProductFactory.with('categories', 1).create()

    const [category] = categories

    const response = await client.put(route('core.products.update', {id}))
      .guard('api').loginAs(user)
      .json({
        categoryId: category.id,
        price: 50,
        name: 'Demo Updated',
        description: 'Demo description updated...',
        sku: 'SKU563',
        publishedAt: DateTime.now(),
      })

    response.assertStatus(200)

    response.assertBodyContains({
      id, name: 'Demo Updated', description: 'Demo description updated...', sku: 'SKU563',
    })
  }).tags(['@core', '@core.products.update'])
})
