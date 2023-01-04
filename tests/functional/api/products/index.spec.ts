import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {CategoryFactory, ProductFactory, ReviewFactory, UserFactory, WishlistFactory} from 'Database/factories'

test.group('API [products.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access to authenticated user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.createMany(10)

    const $response = await client.get(route('api.products.index'))
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

  test('it can allow access to un-authenticated user.', async ({client, route}) => {
    const products = await ProductFactory.createMany(10)

    const $response = await client.get(route('api.products.index'))

    $response.assertStatus(200)

    $response.assertBodyContains({data: products.map((product) => ({id: product.id}))})
  }).tags(['@products', '@products.index'])

  test('it can allow users to search products with random keywords - "{search}"')
    .with([{search: 'Sallad'}, {search: 'Soup'}, {search: 'Letuce'}])
    .run(async ({client, route}, search) => {
      const products = await ProductFactory.merge([
        {name: 'Salmon Sallad'},
        {name: 'Pizza Margharita'},
        {name: 'Shrimps Soup'},
        {name: 'Bacon Burger'},
        {name: 'Bacon Sallad'},
        {name: 'Chicken Soup Curry'},
        {name: 'Salmon'},
        {name: 'Letuce'},
        {name: 'Carrots'},
        {name: 'Chickpeas'},
      ]).createMany(10)

      let $response = await client.get(route('api.products.index', {}, {qs: {search}}))

      $response.assertStatus(200)

      $response.assertBodyContains({
        data: products
          .filter(({name, description}) => name.includes(`${search}`) || description.includes(`${search}`))
          .map((product) => ({id: product.id})),
      })
    })

  test('it can list the products with media.', async ({client, route}) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.with('media', 3).createMany(10)

    const qs = {with: ['products.media']}

    const $response = await client.get(route('api.products.index', {}, {qs}))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        media: product.media.map(({id}) => ({id})),
      })),
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with ingredients.', async ({client, route}) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.with('media', 3).with('ingredients', 4).createMany(10)

    const qs = {with: ['products.ingredients']}

    const $response = await client.get(route('api.products.index', {}, {qs}))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        ingredients: product.ingredients.map(({id}) => ({id})),
      })),
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with ingredients and ingredients categories.', async ({client, route}) => {
    const user = await UserFactory.create()

    const products = await ProductFactory.with('media', 3).with('ingredients', 4).createMany(10)
    const category = await CategoryFactory.merge({type: 'Ingredient'}).create()

    await category.related('ingredients').attach(
      products.map(product => product.ingredients.map(({id}) => id)).flat()
    )

    const qs = {with: ['products.ingredients', 'products.ingredients.categories']}

    const $response = await client.get(route('api.products.index', {}, {qs}))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: products.map((product) => ({
        id: product.id,
        name: product.name,
        price: product.price,
        description: product.description,
        ingredients: product.ingredients.map(({id}) => ({
          id,
          categories: [{id: category.id}],
        })),
      })),
    })
  }).tags(['@products', '@products.index'])

  test('It can list the products with reviews.', async ({client, route}) => {
    const product = await ProductFactory.create()

    const merge: { reviewableId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({reviewableId: product.id})
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    const qs = {with: ['products.reviews']}

    const $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          reviews: reviews.map(({id, title}) => ({id, title})),
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('It can list the products with reviews average.', async ({client, route}) => {
    const product = await ProductFactory.with('reviews', 10, query => query.with('user')).create()

    const ratingCount = product.reviews.map(({rating}) => rating).reduce((prev, curr) => prev + curr, 0)

    const totalAvgRating = ratingCount / product.reviews.length

    const qs = {with: ['products.reviews'], withAvg: ['products.reviews']}

    const $response = await client.get(route('api.products.index', {}, {qs}))

    // $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          reviews: product.reviews.map(({id, title}) => ({id, title})),
          meta: {
            reviews_avg: totalAvgRating,
          },
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('It can list the top rated products.', async ({client, route}) => {
    const user = await UserFactory.create()
    const ProductA = await ProductFactory.create()
    const ProductB = await ProductFactory.create()

    await ReviewFactory.merge([
      {reviewable: 'Product', reviewableId: ProductA.id, rating: 5, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductA.id, rating: 5, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductA.id, rating: 5, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductA.id, rating: 5, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductA.id, rating: 5, userId: user.id},
    ]).createMany(5)

    await ReviewFactory.merge([
      {reviewable: 'Product', reviewableId: ProductB.id, rating: 3, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductB.id, rating: 3, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductB.id, rating: 3, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductB.id, rating: 3, userId: user.id},
      {reviewable: 'Product', reviewableId: ProductB.id, rating: 3, userId: user.id},
    ]).createMany(5)

    const qs = {filters: ['top-rated']}

    const $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({data: [{id: ProductA.id}]})
  }).tags(['@products', '@products.index', '@products.debug'])

  test('it can list the products with availability in the wishlist of the user.', async ({client, route}) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.with('media', 3).create()

    const wishlist = await WishlistFactory.merge({userId: user.id}).create()

    await wishlist.related('products').attach([product.id])

    const qs = {with: ['products.wishlist']}

    const $response = await client.get(route('api.products.index', {}, {qs}))
      .guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          wishlists: [{id: wishlist.id}],
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('it can list the products with media, wishlist, reviews, and ingredients.', async ({client, route}) => {
    const user = await UserFactory.create()

    const wishlist = await WishlistFactory.merge({userId: user.id}).create()

    const product = await ProductFactory.with('media', 3).with('ingredients', 4).create()

    const merge: { reviewableId: number }[] = []

    for (let i = 0; i < 10; i++) {
      merge.push({reviewableId: product.id})
    }

    const reviews = await ReviewFactory.merge(merge).with('user').createMany(10)

    await wishlist.related('products').attach([product.id])

    const qs = {with: ['products.wishlist', 'products.media', 'products.ingredients', 'products.reviews']}

    const $response = await client.get(route('api.products.index', {}, {qs}))
      .guard('api').loginAs(user)

    $response.assertBodyContains({
      data: [
        {
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          wishlists: [{id: wishlist.id}],
          reviews: reviews.map(({id}) => ({id})),
          media: product.media.map(({id}) => ({id})),
          ingredients: product.ingredients.map(({id, name}) => ({id, name})),
        },
      ],
    })
  }).tags(['@products', '@products.index'])

  test('it can list products based on selected categories.', async ({client, route}) => {
    const [PA, PB, PC, PD, PE, PF, PG, PH, PI, PJ] = await ProductFactory.createMany(10)
    const [CA, CB, CC, CD, CE, CF, CG, CH, CI, CJ] = await CategoryFactory.createMany(10)

    await PA.related('categories').attach([CA.id, CB.id])
    await PF.related('categories').attach([CA.id, CB.id])

    let qs = {inCategories: [CA.id, CB.id]}

    let $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [{id: PA.id}, {id: PF.id}],
      meta: {total: 2},
    })

    await PB.related('categories').attach([CA.id, CB.id, CC.id, CD.id])
    await PG.related('categories').attach([CA.id, CB.id, CC.id, CD.id])

    qs = {inCategories: [CA.id, CB.id, CC.id, CD.id]}

    $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {id: PA.id}, {id: PF.id},
        {id: PB.id}, {id: PG.id},
      ],
      meta: {total: 4},
    })

    await PC.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id])
    await PH.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id])

    qs = {inCategories: [CA.id, CB.id, CC.id, CD.id, CE.id, CF.id]}

    $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {id: PA.id}, {id: PF.id},
        {id: PB.id}, {id: PG.id},
        {id: PC.id}, {id: PH.id},
      ],
      meta: {total: 6},
    })

    await PD.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id])
    await PI.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id])

    qs = {inCategories: [CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id]}

    $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {id: PA.id}, {id: PF.id},
        {id: PB.id}, {id: PG.id},
        {id: PC.id}, {id: PH.id},
        {id: PD.id}, {id: PI.id},
      ],
      meta: {total: 8},
    })

    await PE.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id, CI.id, CJ.id])
    await PJ.related('categories').attach([CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id, CI.id, CJ.id])

    qs = {inCategories: [CA.id, CB.id, CC.id, CD.id, CE.id, CF.id, CG.id, CH.id, CI.id, CJ.id]}

    $response = await client.get(route('api.products.index', {}, {qs}))

    $response.assertStatus(200)

    $response.assertBodyContains({
      data: [
        {id: PA.id}, {id: PF.id},
        {id: PB.id}, {id: PG.id},
        {id: PC.id}, {id: PH.id},
        {id: PD.id}, {id: PI.id},
        {id: PE.id}, {id: PJ.id},
      ],
      meta: {total: 10},
    })
  })
})
