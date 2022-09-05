import { Cart } from 'App/Models'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CouponFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [checkout.process]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('un-authenticated user can not process checkout.', async ({ client, route }) => {
    const request = await client.post(route('api.checkouts.process'))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@checkout', '@checkouts.process'])

  test('authenticated user can process checkout.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: user.addresses[0].id,
        payment_method: 'COD',
      })

    request.assertStatus(200)
  }).tags(['@checkout', '@checkouts.process'])

  test('user cannot process checkout without cart.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        address: user.addresses[0].id,
        payment_method: 'COD',
      })

    request.assertStatus(422)
  }).tags(['@checkout', '@checkouts.process'])

  test('user cannot process checkout without invalid cart.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: 5,
        address: user.addresses[0].id,
        payment_method: 'COD',
      })

    request.assertStatus(422)
  }).tags(['@checkout', '@checkouts.process'])

  test('user cannot process checkout without address.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        payment_method: 'COD',
      })

    request.assertStatus(422)
  }).tags(['@checkout', '@checkouts.process'])

  test('user cannot process checkout with a invalid address.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: 52,
        payment_method: 'COD',
      })

    request.assertStatus(422)
  }).tags(['@checkout', '@checkouts.process'])

  test('user cannot process checkout without payment method.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: user.addresses[0].id,
      })

    request.assertStatus(422)
  }).tags(['@checkout', '@checkouts.process'])

  test('user can process checkout with cash on delivery.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    const address = user.addresses[0]

    product.ingredients.map(({ id }) => (cartIngredients[id] = { product_id: product.id }))

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: address.id,
        payment_method: 'COD',
      })

    request.assertStatus(200)

    request.assertBodyContains({
      user_id: user.id,
      payment_method: 'COD',
      address_id: address.id,
      products: [{ id: product.id, name: product.name }],
      ingredients: product.ingredients.map(({ id, name }) => ({ id, name })),
      address: { id: address.id, first_name: address.firstName, last_name: address.lastName },
      user: { id: user.id, first_name: user.firstName, last_name: user.lastName },
    })
  }).tags(['@checkout', '@checkouts.process'])

  test('it can delete the cart on order creation from the referenced cart.', async ({ client, route, assert }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.related('coupons').attach([coupon.id])

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    const address = user.addresses[0]

    product.ingredients.map(({ id }) => (cartIngredients[id] = { product_id: product.id }))

    await user.cart.related('ingredients').attach(cartIngredients)

    const request = await client.post(route('api.checkouts.process'))
      // @ts-ignore
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: address.id,
        payment_method: 'COD',
      })

    const cart = await Cart.query().where('id', user.cart.id).first()

    assert.notEqual(user.cart.id, cart?.id)

    request.assertStatus(200)

    request.assertBodyContains({
      user_id: user.id,
      payment_method: 'COD',
      address_id: address.id,
      products: [{ id: product.id, name: product.name }],
      ingredients: product.ingredients.map(({ id, name }) => ({ id, name })),
      address: { id: address.id, first_name: address.firstName, last_name: address.lastName },
      user: { id: user.id, first_name: user.firstName, last_name: user.lastName },
    })
  }).tags(['@checkout', '@checkouts.process'])
})
