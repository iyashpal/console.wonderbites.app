import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CartFactory, CouponFactory, UserFactory } from 'Database/factories'
import { Coupon } from 'App/Models'

test.group('Api coupons', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need some coupons to list out.
   * ✔ Access the coupons list page.
   * ✔ See the list of coupons in response.
   */
  test('Only logged in user can list the coupons', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const coupons = await CouponFactory.createMany(10)

    const response = await client.get(route('api.coupons.index')).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains(coupons.map(({ id }) => ({ id })))
    assert.equal(response.body().length, coupons.length)
  })

  /**
   * ✔ See cart list without login.
   * ✔ assert request status as Unauthorized.
   */
  test('Guest users can not list the coupons', async ({ client, route }) => {
    const response = await client.get(route('api.coupons.index'))

    response.assertStatus(401)
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need a coupon data prepared for create request.
   * ✔ Post the coupon data to store.
   * ✔ Assert the request status and coupon data in response.
   */
  test('Only authenticated user can create new coupon', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await (await CouponFactory.make()).toObject()

    const response = await client.post(route('api.coupons.store')).guard('api')
      // @ts-ignore
      .loginAs(user).json(coupon)

    response.assertStatus(200)
    response.assertBodyContains({ title: coupon.title, description: coupon.description, code: coupon.code })
  })

  /**
   * ✔ Need a coupon data prepared for create request.
   * ✔ Post the coupon data to store.
   * ✔ Assert the request status and Unauthenticated message.
   */
  test('Unauthenticated user can not create new copuon', async ({ client, route }) => {
    const coupon = await (await CouponFactory.make()).toObject()

    const response = await client.post(route('api.coupons.store')).json(coupon)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need a coupon stored in database.
   * ✔ Post the coupon's updated data to update request.
   * ✔ Assert the request status and updated coupon data.
   */
  test('Only authenticated user can update a coupon.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.put(route('api.coupons.update', { id: coupon.id })).guard('api')

      // @ts-ignore
      .loginAs(user)
      .json({
        ...(await coupon.toObject()),
        title: 'Updated Title for tests.',
        description: 'Updated Description for tests.',
        code: 'UPDATED',
        startedAt: coupon.startedAt.toFormat('yyyy-MM-dd HH:mm:ss'),
        expiredAt: coupon.expiredAt.toFormat('yyyy-MM-dd HH:mm:ss'),
      })

    response.assertStatus(200)
    response.assertBodyContains({
      title: 'Updated Title for tests.',
      description: 'Updated Description for tests.',
      code: 'UPDATED',
    })
  })

  /**
   * ✔ Need a coupon stored in database.
   * ✔ Post the coupon's updated data to update request without login.
   * ✔ Assert the request status and Unauthenticated message.
   */
  test('Un-authenticated user can not update a coupon.', async ({ client, route }) => {
    const coupon = await CouponFactory.create()

    const response = await client.put(route('api.coupons.update', { id: coupon.id }))
      .json({ title: 'Updated Title for tests.', description: 'Updated Description for tests.', code: 'UPDATED' })

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Post the coupon's updated data to update request without login.
   * ✔ Assert the request status and Unauthenticated message.
   */
  test('Only existing coupons can be updated.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.put(route('api.coupons.update', { id: 15 })).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(400)
  })

  /**
   * 
   */
  test('Only authenticated user can see the coupon resource', async ({ client, route }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.get(route('api.coupons.show', { id: coupon.id })).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({
      id: coupon.id,
      title: coupon.title,
      description: coupon.description,
      code: coupon.code,
    })
  })

  /**
   * 
   */
  test('Only existing coupon is accessible via id or request param.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.get(route('api.coupons.show', { id: 15 })).guard('api')
      // @ts-ignore
      .loginAs(user)

    response.assertStatus(400)
  })

  /**
   * 
   */
  test('Un-authenticated user can not see the coupon resource.', async ({ client, route }) => {
    const coupon = await CouponFactory.create()

    const response = await client.get(route('api.coupons.show', { id: coupon.id }))

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthenticated' })
  })

  /**
   * 
   */
  test('Only authenticated user can delete a coupon.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const coupon = await CouponFactory.create()

    const response = await client.delete(route('api.coupons.destroy', { id: coupon.id })).guard('api')

      // @ts-ignore
      .loginAs(user)

    response.assertStatus(200)

    const couponAfterDelete = await Coupon.find(coupon.id)
    assert.notEqual({
      id: couponAfterDelete?.id,
    }, { id: coupon.id })
  })

  /**
   * 
   */
  test('Un-authenticated user can not delete a coupon.', async ({ client, route, assert }) => {
    const coupon = await CouponFactory.create()

    const response = await client.delete(route('api.coupons.destroy', { id: coupon.id }))

    response.assertStatus(401)

    const couponAfterDelete = await Coupon.find(coupon.id)

    assert.equal(couponAfterDelete?.id, coupon.id)
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need cart attached to the user.
   * ✔ Need a coupon to apply.
   * ✔ Post code and cart id to apply the coupon.
   * ✔ Get the coupon details in response.
   */
  test('Coupon code can be applied to checkout/cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const coupon = await CouponFactory.merge({ code: 'FRI24', expiredAt: DateTime.now().plus({ minute: 1 }) }).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({ coupon: coupon.code, cart: cart.id })

    response.assertStatus(200)
    response.assertBodyContains({
      coupon: {
        id: coupon.id,
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      },
    })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need cart attached to the user.
   * ✔ Need a expired coupon to apply.
   * ✔ Post code and cart id to apply the coupon.
   * ✔ Assert expired error in response.
   */
  test('Expired coupon code can not be applied to checkout/cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const coupon = await CouponFactory.merge({ code: 'FRI24', expiredAt: DateTime.now().minus({ day: 1 }) }).create()

    const response = await client.post(route('api.coupons.apply')).loginAs(user)
      .json({ coupon: coupon.code, cart: cart.id })

    response.assertStatus(422)
    response.assertBodyContains({ messages: { coupon: ['Coupon code is expired.'] } })
  })

  /**
   * ✔ Need a user to login.
   * ✔ Need cart attached to the user.
   * ✔ Post a invalid coupon code and cart id to apply the coupon.
   * ✔ Assert errors in response.
   */
  test('Unknown coupon can not apply to cart.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const cart = await CartFactory.merge({ userId: user.id }).create()

    const response = await client.post(route('api.coupons.apply')).guard('api')
      // @ts-ignore
      .loginAs(user)

      .json({ coupon: 'MONDAY_MORNING', cart: cart.id })

    response.assertStatus(422)
    response.assertBodyContains({ messages: { coupon: ['Invalid coupon code.'] } })
  })
})
