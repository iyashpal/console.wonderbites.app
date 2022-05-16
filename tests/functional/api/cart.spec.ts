import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { ProductFactory, UserFactory } from 'Database/factories'

test.group('Api cart', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: User who is not logged in can also access the cart page.
   * 
   * ✔ GET request hit to `route('api.carts.show')` without api guard and authentication.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain empty products and ingridients arrays.
   */
  test('Guest users can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)

    response.assertBodyContains({ products: [], ingridients: [] })
  })

  /**
   * Case: User who is not logged in can also add OR remove products to their cart.
   * 
   * ✔ Need a product.
   * ✔ POST request hit to `route('api.carts.update')` without api guard and authentication 
   *   having body with some required data to add products in cart.
   * ✔ Request status should be OK(200)
   * ✔ Request response body should contain the product details that sent in the request body.
   */
  test('Guest users can add/remove products to their cart', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const addResponse = await client.post(route('api.carts.show')).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    addResponse.assertStatus(200)
    addResponse.assertBodyContains({ products: [{ id: product.id }] })

    const removeResponse = await client.post(route('api.carts.update')).json({
      action: 'DETACH',
      products: [product.id],
    })

    removeResponse.assertStatus(200)
    removeResponse.assertBodyContains({ products: [] })
  })

  /**
   * Case: Authenticated user can also access the cart page.
   * 
   * ✔ GET request hit to `route('api.carts.show')` without api guard and authentication.
   * ✔ Request status should be OK(200).
   * ✔ Request response body should contain empty products and ingridients arrays.
   */
  test('Authenticated user can access the cart', async ({ client, route }) => {
    const response = await client.get(route('api.carts.show'))

    response.assertStatus(200)

    response.assertBodyContains({ products: [], ingridients: [] })
  })

  /**
   * Case: Authenticated user can also add OR remove products to their cart.
   * 
   * ✔ Need a product.
   * ✔ POST request hit to `route('api.carts.update')` without api guard and authentication 
   *   having body with some required data to add products in cart.
   * ✔ Request status should be OK(200)
   * ✔ Request response body should contain the product details that sent in the request body.
   */
  test('Authenticated user can add/remove products to their cart', async ({ client, route }) => {
    const user = await UserFactory.create()

    const product = await ProductFactory.create()

    const addResponse = await client.post(route('api.carts.show')).loginAs(user).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    addResponse.assertStatus(200)
    addResponse.assertBodyContains({ products: [{ id: product.id }] })

    const removeResponse = await client.post(route('api.carts.update')).json({
      action: 'DETACH',
      products: [product.id],
    })

    removeResponse.assertStatus(200)
    removeResponse.assertBodyContains({ products: [] })
  })

  /**
   * Case: Cart product list should contain the product quentity.
   * 
   * ✔ Need a product.
   * ✔ Request execution.
   * ✔ Add product to cart.
   * ✔ Get cart products list.
   * ✔ Each product should have pivot columns.
   */
  test('Cart product should contain the quentity added by the user.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const request = await client.post(route('api.carts.show')).json({
      action: 'SYNC',
      products: {
        [product.id]: { qty: 5 },
      },
    })

    request.assertStatus(200)
    request.assertBodyContains({
      products: [
        {
          id: product.id,
          meta: {
            pivot_qty: 5, pivot_product_id: product.id.toString(),
          },
        },
      ],
    })
  })
})
