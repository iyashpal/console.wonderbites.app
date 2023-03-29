import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {ProductFactory, UserFactory} from 'Database/factories'

test.group('Core [products.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it throws 401 status code when the user is not logged in.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const response = await client.get(route('core.products.show', product))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products.show'])

  test('it reads 401 status code when the user is logged in with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.products.show'])

  test('it shows product when the user is logged in and have correct role assigned.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({product: {id: product.id}})
  }).tags(['@core', '@core.products.show'])

  test('it reads the id of referenced product.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({product: {id: product.id}})
  }).tags(['@core', '@core.products.show'])

  test('it reads the list of referenced product categories.', async ({client, route}) => {
    const product = await ProductFactory.with('categories', 1).create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      product: {
        id: product.id, categories: product.categories.map(({id, name}) => ({id, name})),
      },
    })
  }).tags(['@core', '@core.products.show'])

  test('it reads the list of referenced product ingredients.', async ({client, route}) => {
    const product = await ProductFactory.with('ingredients', 5).create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({
      product: {
        id: product.id, ingredients: product.ingredients.map(({id, name}) => ({id, name})),
      },
    })
  }).tags(['@core', '@core.products.show'])

  test('it reads the product media in response.', async ({client, route}) => {
    const product = await ProductFactory.with('media', 5).create()
    const user = await UserFactory.with('role').create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      product: {
        id: product.id, media: product.media.map(({id, title}) => ({id, title})),
      },
    })
  }).tags(['@core', '@core.products.show'])

  test('it reads the product media meta fields.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const product = await ProductFactory.with('media', 1).create()
    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      product: {
        id: product.id, media: product.media.map(({id, title}) => ({
          id, title, meta: {pivot_product_id: product.id, pivot_media_id: id, pivot_is_default: 0, pivot_order: 0},
        })),
      },
    })
  }).tags(['@core', '@core.products.show'])
})
