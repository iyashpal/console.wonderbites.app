import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, ReviewFactory } from 'Database/factories'

test.group('API [reviews.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can allow access to all users.', async ({ client, route }) => {
    const request = await client.get(route('api.reviews.index'))

    request.assertStatus(200)
  }).tags(['@reviews', '@reviews.index'])

  test('it can list the reviews.', async ({ client, route, assert }) => {
    const reviews = await ReviewFactory.with('user').apply('typeProduct').createMany(1)

    const request = await client.get(route('api.reviews.index'))

    request.assertStatus(200)

    assert.equal(request.body().data.length, reviews.length)

    request.assertBodyContains({
      data: reviews.map(({ id, title, body }) => ({ id, title, body })),
    })
  }).tags(['@reviews', '@reviews.index'])

  test('it can list the reviews with author.', async ({ client, route, assert }) => {
    const reviews = await ReviewFactory.with('user').createMany(10)
    await reviews.map(async review => await review.load('user'))

    const request = await client.get(route('api.reviews.index', {}, { qs: { with: ['review.user'] } }))

    request.assertStatus(200)

    assert.equal(request.body().data.length, reviews.length)

    request.assertBodyContains({
      data: reviews.map(({ id, user }) => ({ id, user_id: user.id, user: { id: user.id } })),
    })
  }).tags(['@reviews', '@reviews.index'])

  test('it can list the reviews with products.', async ({ client, route, assert }) => {
    const reviews = await ReviewFactory.with('user').with('product').createMany(10)

    const qs = { with: ['review.product'] }

    const request = await client.get(route('api.reviews.index', {}, { qs }))

    request.assertStatus(200)

    assert.equal(request.body().data.length, reviews.length)

    request.assertBodyContains({
      data: reviews.map(({ id, product }) => ({ id: id, type_id: product.id, product: { id: product.id } })),
    })
  }).tags(['@reviews', '@reviews.index'])

  test('it can list reviews based on product identifier.', async ({ client, route, assert }) => {
    const product = await ProductFactory.create()
    const reviews = [
      ...await ReviewFactory.with('user').merge({ type: 'Product', typeId: product.id }).createMany(6),
      ...await ReviewFactory.with('user').with('product').createMany(4),
    ]

    const request = await client.get(route('api.reviews.index', {}, { qs: { product: product.id } }))

    assert.equal(request.body().data.length, 6)

    request.assertStatus(200)

    request.assertBodyContains({
      data: reviews.filter((review) => review.typeId === product.id).map(({ id }) => ({ id })),
    })
  }).tags(['@reviews', '@reviews.index'])
})
