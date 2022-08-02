import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, MediaFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('Api category show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('[Index] All users can see the list of categories.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const categories = await CategoryFactory.createMany(5)

    const guestRequest = await client.get(route('api.categories.index')).accept('json')

    guestRequest.assertStatus(200)

    guestRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(guestRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))

    const authRequest = await client.get(route('api.categories.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    authRequest.assertStatus(200)

    authRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(authRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))
  }).tags(['@category'])

  test('[Index] it should contain the list of products under it.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const category = await CategoryFactory.create()

    await category.related('products').attach([product.id])

    const request = await client.get(route('api.categories.index', {}, { qs: { with: ['category.products'] } }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
        },
      ],
    }])
  }).tags(['@category'])

  test('[Index] it should contain the list of media under products.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const category = await CategoryFactory.create()
    const media = await MediaFactory.createMany(5)

    product.related('media').attach(media.map(({ id }) => id))

    await category.related('products').attach([product.id])

    const queryString = { type: 'product', with: ['category.products', 'category.products.media'] }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          media: media.map(
            ({ id, title, caption, filePath }) => ({ id, title, caption, file_path: filePath })
          ),
        },
      ],
    }])
  }).tags(['@category'])

  test('[Index] it should list only given type of categories.', async ({ client, route, assert }) => {
    await CategoryFactory.merge([
      { type: 'Product' },
      { type: 'Product' },
      { type: 'Ingredient' },
      { type: 'Product' },
      { type: 'Cuisine' },
      { type: 'Ingredient' },
      { type: 'Cuisine' },
      { type: 'Ingredient' },
      { type: 'Cuisine' },
      { type: 'Blog' },
    ]).createMany(10)

    const productCategories = await client.get(route('api.categories.index', {}, { qs: { type: 'product' } }))

    productCategories.assertStatus(200)

    assert.equal(3, productCategories.body().length)

    const ingredientCategories = await client.get(route('api.categories.index', {}, { qs: { type: 'ingredient' } }))

    ingredientCategories.assertStatus(200)

    assert.equal(3, ingredientCategories.body().length)

    const cuisineCategories = await client.get(route('api.categories.index', {}, { qs: { type: 'cuisine' } }))

    cuisineCategories.assertStatus(200)

    assert.equal(3, cuisineCategories.body().length)

    const blogCategories = await client.get(route('api.categories.index', {}, { qs: { type: 'blog' } }))

    blogCategories.assertStatus(200)

    assert.equal(1, blogCategories.body().length)
  }).tags(['@category'])
})
