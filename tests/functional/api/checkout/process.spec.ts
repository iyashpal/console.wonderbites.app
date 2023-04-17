import { Cart } from 'App/Models'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory, CartFactory, CouponFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('API [checkout.process]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('un-authenticated user can access process checkout.', async ({ client, route }) => {
    const cart = await CartFactory.create()
    const address = await AddressFactory.with('user').create()

    const $response = await client.post(route('api.checkouts.process')).json({
      cart: cart.id,
      address: address.serializedForCheckout,
      options: { payment: { mode: 'COD' } },
    })

    $response.assertStatus(200)
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('authenticated user can process checkout.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const [address] = user.addresses

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        note: 'Test note for the order',
        options: { payment: { mode: 'COD' } },
        address: address.serializedForCheckout,
      })

    $response.assertStatus(200)

    $response.assertBodyContains({
      deliver_to: JSON.stringify(address.serializedForCheckout),
      options: JSON.stringify({ payment: { mode: 'COD' } }),
      note: 'Test note for the order',
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user cannot process checkout without cart.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const [address] = user.addresses

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        options: { payment: { mode: 'COD' } },
        address: address.serializedForCheckout,
      })

    $response.assertStatus(422)

    $response.assertBodyContains({ errors: { cart: 'required validation failed' } })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user cannot process checkout without invalid cart.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').with('addresses').create()

    const [address] = user.addresses

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        cart: 5,
        address: address.serializedForCheckout,
        options: { payment: { mode: 'COD' } },
      })

    $response.assertStatus(422)

    $response.assertBodyContains({ errors: { cart: 'exists validation failure' } })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user cannot process checkout without address.', async ({ client, route }) => {
    const user = await UserFactory.with('cart').create()

    const product = await ProductFactory.with('ingredients', 3).create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    await user.cart.related('products').attach([product.id])

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { product_id: product.id }
    })

    await user.cart.related('ingredients').attach(cartIngredients)

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        options: { payment: { mode: 'COD' } },
      })

    $response.assertStatus(422)

    $response.assertBodyContains({
      errors: { address: 'required validation failed' },
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user cannot process checkout with a invalid address.', async ({ client, route }) => {
    const user = await UserFactory
      .with('cart', 1, cart => cart.with('products', 5))
      .with('addresses')
      .create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: 55,
        options: { payment: { mode: 'COD' } },
      })

    $response.assertStatus(422)

    $response.assertBodyContains({ errors: { address: 'object validation failed' } })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user cannot process checkout without payment method.', async ({ client, route }) => {
    const user = await UserFactory
      .with('cart', 1, cart => cart.with('products', 5))
      .with('addresses').create()

    const [address] = user.addresses

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    const $response = await client.post(route('api.checkouts.process'))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        options: { payment: {} },
        address: address.serializedForCheckout,
      })

    $response.assertStatus(422)

    $response.assertBodyContains({
      errors: { 'options.payment.mode': 'required validation failed' },
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('user can process checkout with cash on delivery.', async ({ client, route }) => {
    const user = await UserFactory
      .with('cart', 1, cart => cart.with('products', 5))
      .with('addresses').create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    const [address] = user.addresses

    const qs = { with: ['checkout.products', 'checkout.user'] }

    const $response = await client.post(route('api.checkouts.process', {}, { qs }))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: address.serializedForCheckout,
        options: { payment: { mode: 'COD' } },
      })

    $response.assertStatus(200)

    $response.assertBodyContains({
      user_id: user.id,
      options: JSON.stringify({ payment: { mode: 'COD' } }),
      products: user.cart.products.map(({ id, name }) => ({ id, name })),
      deliver_to: JSON.stringify(address.serializedForCheckout),
      user: { id: user.id, first_name: user.firstName, last_name: user.lastName },
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])

  test('it can delete the cart on order creation from the referenced cart.', async ({ client, route, assert }) => {
    const user = await UserFactory
      .with('cart', 1, cart => cart.with('products', 5))
      .with('addresses').create()

    const coupon = await CouponFactory.create()

    await user.cart.merge({ couponId: coupon.id }).save()

    const [address] = user.addresses

    const qs = { with: ['checkout.products', 'checkout.user'] }

    const $response = await client.post(route('api.checkouts.process', {}, { qs }))
      .guard('api').loginAs(user).json({
        cart: user.cart.id,
        address: address.serializedForCheckout,
        options: { payment: { mode: 'COD' } },
      })

    const cart = await Cart.query().where('id', user.cart.id).first()

    assert.isUndefined(cart?.id)

    $response.assertStatus(200)

    $response.assertBodyContains({
      user_id: user.id,
      options: JSON.stringify({ payment: { mode: 'COD' } }),
      deliver_to: JSON.stringify(address.serializedForCheckout),
      products: user.cart.products.map(({ id, name }) => ({ id, name })),
      user: { id: user.id, first_name: user.firstName, last_name: user.lastName },
    })
  }).tags(['@api', '@api.checkout', '@api.checkouts.process'])
})
