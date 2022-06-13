import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory, WishlistFactory } from 'Database/factories'

test.group('Api product', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Users can access the product details.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    await WishlistFactory.merge({ userId: user.id }).create()

    const response = await client.get(route('api.products.show', product)).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertBodyContains({ name: product.name, description: product.description, price: product.price })
    // response.dumpBody()
  })
})
