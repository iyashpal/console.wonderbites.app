import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, ReviewFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('API [products.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access authenticated user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const $response = await client.get(route('api.products.show', product))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
    })
  }).tags(['@products', '@products.show'])

  test('it can allow access to un-authenticated user.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const $response = await client.get(route('api.products.show', product))

    $response.assertStatus(200)

    $response.assertBodyContains({ id: product.id })
  }).tags(['@products', '@products.show'])

  test('it reads the customizable property', async ({client, route}) => {
    const product = await ProductFactory.create()

    const $response = await client.get(route('api.products.show', product))

    $response.assertStatus(200)

    $response.assertBodyContains({ id: product.id, is_customizable: Number(product.isCustomizable), })
  }).tags(['@products', '@products.show'])

  test('it can load the product media.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.with('media', 3).create()

    const qs = { with: ['product.media'] }

    const $response = await client.get(route('api.products.show', product, { qs }))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      media: product.media.map(({ id }) => ({ id })),
    })
  }).tags(['@products', '@products.show'])

  test('it can load the associated ingredients of product.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.with('media', 3).with('ingredients', 4).create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach([product.id])

    const qs = { with: ['product.ingredients'] }

    const $response = await client.get(route('api.products.show', product, { qs }))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      ingredients: product.ingredients.map(({ id }) => ({ id })),
    })
  }).tags(['@products', '@products.show'])

  test('It can load the product reviews.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const merge: { reviewableId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({ reviewableId: product.id })
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    const qs = { with: ['product.reviews'] }

    const $response = await client.get(route('api.products.show', product, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains({
      id: product.id,
      reviews: reviews.map(({ id, title }) => ({ id, title })),
    })
  }).tags(['@products', '@products.show'])

  test('It can show product with reviews total average.', async ({ client, route }) => {
    const product = await ProductFactory.with('reviews', 9, query => query.with('user')).create()

    const totalReviewsSum = product.reviews.map(({ rating }) => rating).reduce((prev, curr) => prev + curr, 0)

    const productReviewsAvg = totalReviewsSum / product.reviews.length

    const $response = await client.get(route('api.products.show', product, { qs: { withAvg: ['product.reviews'] } }))

    $response.assertStatus(200)
    $response.assertBodyContains({
      id: product.id,
      meta: {
        reviews_avg: productReviewsAvg,
      },
    })
  }).tags(['@products', '@products.show'])

  test('it can load the product\'s availability in wishlist of the user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.with('media', 3).create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach([product.id])

    const qs = { with: ['product.wishlist'] }

    const $response = await client.get(route('api.products.show', product, { qs }))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      wishlists: [{ id: wishlist.id }],
    })
  }).tags(['@products', '@products.show'])

  test('it can load the product media, wishlist, reviews, and ingredients.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    const product = await ProductFactory.with('media', 3).with('ingredients', 4).create()

    const merge: { reviewableId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({ reviewableId: product.id })
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    await wishlist.related('products').attach([product.id])

    const qs = { with: ['product.wishlist', 'product.media', 'product.ingredients', 'product.reviews'] }

    const $response = await client.get(route('api.products.show', product, { qs }))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      description: product.description,
      wishlists: [{ id: wishlist.id }],
      reviews: reviews.map(({ id }) => ({ id })),
      media: product.media.map(({ id }) => ({ id })),
      ingredients: product.ingredients.map(({ id, name }) => ({ id, name })),
    })
  }).tags(['@products', '@products.show'])
})
