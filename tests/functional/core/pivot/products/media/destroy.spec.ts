import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {ProductFactory, UserFactory} from 'Database/factories'

test.group('Core [pivot.products.media.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when user is not logged in.', async ({ client, route }) => {
    const product = await ProductFactory.with('media', 1).create()
    const [media] = product.media
    const params = { product_id: product.id, id: media.id }
    const response = await client.delete(route('core.pivot.products.media.destroy', params))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.pivot.products.media.destroy'])

  test('it reads 401 status code when user is logged with a invalid role.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const product = await ProductFactory.with('media', 1).create()
    const [media] = product.media
    const params = { product_id: product.id, id: media.id }
    const response = await client.delete(route('core.pivot.products.media.destroy', params))
      .guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.pivot.products.media.destroy'])

  test('it reads 200 status code when user is logged in with a valid role.', async ({ client, route }) => {
    const user = await UserFactory.with('role').create()
    const product = await ProductFactory.with('media', 1).create()
    const [media] = product.media
    const params = { product_id: product.id, id: media.id }
    const response = await client.delete(route('core.pivot.products.media.destroy', params))
      .guard('api').loginAs(user)

    response.assertStatus(200)
  }).tags(['@core', '@core.pivot.products.media.destroy'])
})
