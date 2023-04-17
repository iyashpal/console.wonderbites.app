import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [categories.show]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('all users can see the category details.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const category = await CategoryFactory.with('products', 5).create()

    const request = await client.get(route('api.categories.show', category))

    request.assertStatus(200)

    request.assertBodyContains({
      id: category.id,
      name: category.name,
      type: category.type,
      description: category.description,
    })

    const authRequest = await client.get(route('api.categories.show', category))
      .guard('api').loginAs(user)

    authRequest.assertStatus(200)

    authRequest.assertBodyContains({
      id: category.id,
      name: category.name,
      type: category.type,
      description: category.description,
    })
  }).tags(['@api', '@api.categories', '@api.categories.show'])

  test('it can load products under category details', async ({ client, route, assert }) => {
    const category = await CategoryFactory.with('products', 5).create()

    const request = await client.get(route('api.categories.show', category, { qs: { with: ['products'] } }))

    request.assertStatus(200)

    request.assertBodyContains({ id: category.id, products: [] })

    assert.equal(5, request.body().products.length)
  }).tags(['@api', '@api.categories', '@api.categories.show'])

  test('it can load media under category product', async ({ client, route, assert }) => {
    const category = await CategoryFactory.create()

    const product = await ProductFactory.with('media', 3).create()

    category.related('products').attach([product.id])

    const qs = { with: ['products', 'products.media'] }

    const request = await client.get(route('api.categories.show', category, { qs }))

    request.assertStatus(200)

    request.assertBodyContains({ id: category.id, products: [{ media: [] }] })

    const { products } = request.body()

    assert.equal(1, products.length)

    assert.equal(3, products[0]?.media.length)
  }).tags(['@api', '@api.categories', '@api.categories.show'])

  test('it can load ingredients under category details', async ({ client, route, assert }) => {
    const category = await CategoryFactory.with('ingredients', 3).create()

    const qs = { with: ['ingredients'] }

    const request = await client.get(route('api.categories.show', category, { qs }))

    request.assertStatus(200)

    request.assertBodyContains({ id: category.id, ingredients: [] })

    const { ingredients } = request.body()

    assert.equal(3, ingredients.length)
  }).tags(['@api', '@api.categories', '@api.categories.show'])

  test('it can load cuisines under category details', async ({ client, route, assert }) => {
    const category = await CategoryFactory.with('cuisines', 3).create()

    const qs = { with: ['cuisines'] }

    const request = await client.get(route('api.categories.show', category, { qs }))

    request.assertStatus(200)

    request.assertBodyContains({ id: category.id, cuisines: [] })

    const { cuisines } = request.body()

    assert.equal(3, cuisines.length)
  }).tags(['@api', '@api.categories', '@api.categories.show'])
})
