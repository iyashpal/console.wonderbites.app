import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('API [checkout.process]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('un-authenticated user can not process checkout.', async ({ client, route }) => {
    const request = await client.post(route('api.checkout.process'))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@checkout', '@checkout.process'])

  test('authenticated user can process checkout.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    user.cart.related('products').attach([product.id])

    const request = await client.post(route('api.checkout.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ cart: user.cart.id })

    request.assertStatus(200)
  }).tags(['@checkout', '@checkout.process'])
})
