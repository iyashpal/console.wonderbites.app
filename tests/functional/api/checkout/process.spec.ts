import { test } from '@japa/runner'
import { CartProduct } from 'App/Models/Pivot'
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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

    const CART_PRODUCT = await CartProduct.query()
      .where('cart_id', user.cart.id)
      .where('product_id', product.id).first()

    const cartIngredients = {}

    product.ingredients.map(({ id }) => {
      cartIngredients[id] = { cart_product_id: CART_PRODUCT?.id }
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
})
