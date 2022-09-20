import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, ReviewFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('API [products.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access to authenticated user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.createMany(10)

    const $response = await client.get(route('api.products.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
      })),
    })
  }).tags(['@products', '@products.index'])

  test('it can allow access to un-authenticated user.', async ({ client, route }) => {
    const products = await ProductFactory.createMany(10)

    const $response = await client.get(route('api.products.index'))

    $response.assertStatus(200)

    $response.assertBodyContains({ data: products.map((product) => ({ id: product.id })) })
  }).tags(['@products', '@products.index'])

  test('it can allow users to search products with random keywords - "{search}"')
    .with([{ search: 'Sallad' }, { search: 'Soup' }, { search: 'Letuce' }])
    .run(async ({ client, route }, search) => {
      const products = await ProductFactory.merge([
        { name: 'Salmon Sallad' },
        { name: 'Pizza Margharita' },
        { name: 'Shrimps Soup' },
        { name: 'Bacon Burger' },
        { name: 'Bacon Sallad' },
        { name: 'Chicken Soup Curry' },
        { name: 'Salmon' },
        { name: 'Letuce' },
        { name: 'Carrots' },
        { name: 'Chickpeas' },
      ]).createMany(10)

      let $response = await client.get(route('api.products.index', {}, { qs: { search } }))

      $response.assertStatus(200)

      $response.assertBodyContains({
        data: products
          .filter(({ name, description }) => name.includes(`${ search }`) || description.includes(`${ search }`))
          .map((product) => ({ id: product.id })),
      })
    })

  test('it can list the products with media.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.with('media', 3).createMany(10)

    const qs = { with: ['products.media'] }

    const $response = await client.get(route('api.products.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        media: product.media.map(({ id }) => ({ id })),
      })),
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with ingredients.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.with('media', 3).with('ingredients', 4).createMany(10)

    const qs = { with: ['products.ingredients'] }

    const $response = await client.get(route('api.products.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        ingredients: product.ingredients.map(({ id }) => ({ id })),
      })),
    })
  }).tags(['@products', '@products.index'])

  test('It can list the products with reviews.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const merge: { typeId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({ typeId: product.id })
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    const qs = { with: ['products.reviews'] }

    const $response = await client.get(route('api.products.index', {}, { qs }))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          reviews: reviews.map(({ id, title }) => ({ id, title })),
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with availability in the wishlist of the user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.with('media', 3).create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    await wishlist.related('products').attach([product.id])

    const qs = { with: ['products.wishlist'] }

    const $response = await client.get(route('api.products.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          wishlists: [{ id: wishlist.id }],
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with media, wishlist, reviews, and ingredients.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const wishlist = await WishlistFactory.merge({ userId: user.id }).create()

    const product = await ProductFactory.with('media', 3).with('ingredients', 4).create()

    const merge: { typeId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({ typeId: product.id })
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    await wishlist.related('products').attach([product.id])

    const qs = { with: ['products.wishlist', 'products.media', 'products.ingredients', 'products.reviews'] }

    const $response = await client.get(route('api.products.index', {}, { qs }))
      // @ts-ignore
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          wishlists: [{ id: wishlist.id }],
          reviews: reviews.map(({ id }) => ({ id })),
          media: product.media.map(({ id }) => ({ id })),
          ingredients: product.ingredients.map(({ id, name }) => ({ id, name })),
        },
      ],
    })
  }).tags(['@products', '@products.index'])
})
