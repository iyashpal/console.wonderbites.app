import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import Application from '@ioc:Adonis/Core/Application'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('Core [pivot.products.media.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is not logged in.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const response = await client.post(route('core.pivot.products.media.store', { product_id: product.id }))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.pivot.products.media.store'])

  test('it reads 401 status code when user is logged with a invalid role.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.create()
    const response = await client.post(route('core.pivot.products.media.store', { product_id: product.id }))
      .guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.pivot.products.media.store'])

  test('it reads 200 status code when user is logged in with a valid role.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.pivot.products.media.store', { product_id: product.id }))
      .guard('api').loginAs(user)
      .file('attachment', Application.publicPath('/images/logo.svg'))
      .fields({order: 5})

    response.assertStatus(200)
    response.assertBodyContains({title: `${product.name} #${5}`})
  }).tags(['@core', '@core.pivot.products.media.store'])

  test('it reads 422 status code when missing attachment in request payload.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.pivot.products.media.store', {product_id: product.id}))
      .guard('api').loginAs(user).fields({order: 5})

    response.assertStatus(422)
    response.assertBodyContains({errors: { attachment: 'required validation failed'}})
  }).tags(['@core', '@core.pivot.products.media.store'])

  test('it reads 200 status code even when the order is missing in request payload.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.pivot.products.media.store', {product_id: product.id}))
      .guard('api').loginAs(user).file('attachment', Application.publicPath('/images/logo.svg'))

    response.assertStatus(200)
    response.assertBodyContains({title: `${product.name} #${1}`})
  }).tags(['@core', '@core.pivot.products.media.store'])

  test('it reads 200 status code when the order is set in request payload.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()
    const response = await client.post(route('core.pivot.products.media.store', {product_id: product.id}))
      .guard('api').loginAs(user)
      .file('attachment', Application.publicPath('/images/logo.svg'))
      .fields({ order: 10 })

    response.assertStatus(200)
    response.assertBodyContains({title: `${product.name} #${10}`})
  }).tags(['@core', '@core.pivot.products.media.store'])
})
