import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { ProductFactory } from 'Database/factories'

test.group('API [carts.quick]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User can add products without customization', async ({ client, route }) => {
    const product = await ProductFactory.with('ingredients', 5).create()

    let qs = {with: ['cart.products', 'cart.ingredients']}

    const response = await client.put(route('api.carts.quick', {}, { qs }))
      .json({ products: [product.id] })

    response.assertStatus(200)

    response.assertBodyContains({})
  }).tags(['@api', '@api.carts', '@api.carts.quick'])
})
