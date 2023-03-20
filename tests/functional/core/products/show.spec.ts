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

  test(
    'it throws 401 status code when the user is logged in but don\'t have correct role assigned.',

    async ({client, route}) => {
      const user = await UserFactory.create()

      const product = await ProductFactory.create()

      const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

      response.assertStatus(401)

      response.assertBodyContains({message: 'Unauthorized access'})
    }
  ).tags(['@core', '@core.products.show'])

  test('it shows product when the user is logged in and have correct role assigned.', async ({client, route}) => {
    const product = await ProductFactory.create()
    const user = await UserFactory.with('role').create()

    const response = await client.get(route('core.products.show', product)).guard('api').loginAs(user)

    response.assertStatus(200)

    response.assertBodyContains({product: {id: product.id}})
  }).tags(['@core', '@core.products.show'])
})
