import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {
  CategoryFactory, CuisineFactory, IngredientFactory, MediaFactory, ProductFactory, UserFactory,
} from 'Database/factories'

test.group('API [categories.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('all users can see the list of categories.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const categories = await CategoryFactory.createMany(5)

    const guestRequest = await client.get(route('api.categories.index')).accept('json')

    guestRequest.assertStatus(200)

    guestRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(guestRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))

    const authRequest = await client.get(route('api.categories.index'))
      .guard('api').loginAs(user)

    authRequest.assertStatus(200)

    authRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(authRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))
  }).tags(['@categories', '@categories.index'])

  test('it should contain the list of products under it.', async ({ client, route }) => {
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
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products with media under it.', async ({ client, route }) => {
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
          media: media.map(({ id, title, caption }) => ({ id, title, caption })),
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products with ingredients under it', async ({ client, route }) => {
    const product = await ProductFactory.with('ingredients', 5).create()
    const category = await CategoryFactory.create()

    await category.related('products').attach([product.id])

    const queryString = {
      type: 'product', with: [
        'category.products',
        'category.products.media',
        'category.products.ingredients',
      ],
    }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          ingredients: product.ingredients.map(
            ({ id, name, description }) => ({ id, name, description })
          ),
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products with reviews under it', async ({ client, route }) => {
    const product = await ProductFactory.with('reviews', 5, query => query.with('user', 6)).create()
    const category = await CategoryFactory.create()

    await category.related('products').attach([product.id])

    const queryString = {
      type: 'product', with: [
        'category.products',
        'category.products.media',
        'category.products.reviews',
      ],
    }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          reviews: product.reviews.map(
            ({ id, title }) => ({ id, title })
          ),
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products with reviews average rating under it', async ({ client, route }) => {
    const product = await ProductFactory.with('reviews', 5, query => query.with('user', 6)).create()
    const category = await CategoryFactory.create()

    await product.loadAggregate('reviews', reviews => reviews.avg('rating').as('averate_rating'))

    await category.related('products').attach([product.id])

    const queryString = {
      type: 'product', with: [
        'category.products',
        'category.products.media',
        'category.products.reviews-avg',
      ],
    }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          meta: {
            average_rating: product.$extras.average_rating,
          },
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products with wishlist under it', async ({ client, route }) => {
    const category = await CategoryFactory.create()
    const user = await UserFactory.with('wishlist').create()
    const product = await ProductFactory.with('reviews', 5, query => query.with('user', 6)).create()

    await user.wishlist.related('products').attach([product.id])

    await product.loadAggregate('reviews', reviews => reviews.avg('rating').as('averate_rating'))

    await category.related('products').attach([product.id])

    const queryString = {
      type: 'product',
      with: [
        'category.products',
        'category.products.media',
        'category.products.wishlist',
        'category.products.reviews-avg',
      ],
    }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          wishlists: [{ id: user.wishlist.id }],
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it contains the list of products searched by custom keyword under it', async ({ client, route, assert }) => {
    const category = await CategoryFactory.create()
    const product = await ProductFactory.with('reviews', 5, query => query.with('user', 6)).create()

    await category.related('products').attach([product.id])

    const queryString = {
      type: 'product',
      searchable: ['products'],
      search: 'search keyword',
      with: [
        'category.products',
        'category.products.search',
      ],
    }

    const request = await client.get(route('api.categories.index', {}, { qs: queryString }))

    request.assertStatus(200)

    const [c] = request.body()

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [],
    }])

    assert.equal(0, c.products.length)
  }).tags(['@categories', '@categories.index'])

  test('it should list only given type of categories.', async ({ client, route, assert }) => {
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
  }).tags(['@categories', '@categories.index'])

  test('it should contain the list of ingredients under it', async ({ client, route }) => {
    const ingredient = await IngredientFactory.create()

    const category = await CategoryFactory.create()

    await category.related('ingredients').attach([ingredient.id])

    const request = await client.get(route('api.categories.index', {}, { qs: { with: ['category.ingredients'] } }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      ingredients: [
        {
          id: ingredient.id,
          name: ingredient.name,
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])

  test('it should contain the list of cuisines under it', async ({ client, route }) => {
    const cuisine = await CuisineFactory.create()

    const category = await CategoryFactory.create()

    await category.related('cuisines').attach([cuisine.id])

    const request = await client.get(route('api.categories.index', {}, { qs: { with: ['category.cuisines'] } }))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      cuisines: [
        {
          id: cuisine.id,
          name: cuisine.name,
        },
      ],
    }])
  }).tags(['@categories', '@categories.index'])
})
