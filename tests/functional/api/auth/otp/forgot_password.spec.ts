import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import { DateTime } from 'luxon'

test.group('API [auth.otp.forgot-password]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return ()=> Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to an authenticated user', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.post(route('api.otp.forgot-password')).guard('api').loginAs(user)

    $response.assertStatus(401)
    $response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it allows access to a guest user.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const $response = await client.post(route('api.otp.forgot-password'))
      .json({ email: user.email })

    $response.assertStatus(200)
    $response.assertBodyContains({ success:true, user: user.id, source: user.email })
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when email and mobile is empty.', async ({ client, route }) => {
    const $response = await client.post(route('api.otp.forgot-password'))
    $response.assertStatus(422)
    $response.assertBodyContains({
      errors: {
        email: 'requiredIfNotExists validation failed',
        mobile: 'requiredIfNotExists validation failed',
      },
    })
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it ignores mobile validation error when email field exists in payload.')
    .run(async ({ client, route, assert }) => {
      const $response = await client.post(route('api.otp.forgot-password')).json({ email: 'info@example.com' })
      $response.assertStatus(422)
      assert.notProperty($response.body().errors, 'mobile')
      $response.assertBodyContains({errors: { email: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it ignores email validation error when mobile field exists in payload.')
    .run(async ({ client, route, assert }) => {
      const $response = await client.post(route('api.otp.forgot-password')).json({ mobile: '0123456789' })
      $response.assertStatus(422)
      assert.notProperty($response.body().errors, 'email')
      $response.assertBodyContains({errors: { mobile: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when email is not valid.')
    .run(async ({ client, route, assert }) => {
      const $response = await client.post(route('api.otp.forgot-password')).json({ email: 'invalid email' })
      $response.assertStatus(422)
      assert.property($response.body().errors, 'email')
      assert.notProperty($response.body().errors, 'mobile')
      $response.assertBodyContains({errors: { email: 'email validation failed' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when email does not exists in database.')
    .run(async ({ client, route, assert }) => {
      const $response = await client.post(route('api.otp.forgot-password')).json({ email: 'info@example.com' })
      $response.assertStatus(422)
      assert.property($response.body().errors, 'email')
      assert.notProperty($response.body().errors, 'mobile')
      $response.assertBodyContains({errors: { email: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when mobile does not exists in database.')
    .run(async ({ client, route, assert }) => {
      const $response = await client.post(route('api.otp.forgot-password')).json({ mobile: '012345679' })
      $response.assertStatus(422)
      assert.property($response.body().errors, 'mobile')
      assert.notProperty($response.body().errors, 'email')
      $response.assertBodyContains({errors: { mobile: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when user associated with email is deleted.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.merge({deletedAt: DateTime.now()}).create()
      const $response = await client.post(route('api.otp.forgot-password')).json({ email: user.email })
      $response.assertStatus(422)
      assert.property($response.body().errors, 'email')
      assert.notProperty($response.body().errors, 'mobile')
      $response.assertBodyContains({errors: { email: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it throws validation error when user associated with mobile is deleted.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.merge({deletedAt: DateTime.now()}).create()
      const $response = await client.post(route('api.otp.forgot-password')).json({ mobile: user.mobile })
      $response.assertStatus(422)
      assert.property($response.body().errors, 'mobile')
      assert.notProperty($response.body().errors, 'email')
      $response.assertBodyContains({errors: { mobile: 'exists validation failure' }})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it sends OTP to email and mobile when email is placed in payload.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const $response = await client.post(route('api.otp.forgot-password')).json({ email: user.email })
      $response.assertStatus(200)
      assert.notProperty($response.body(), 'errors')
      $response.assertBodyContains({success: true, source: user.email, user: user.id})
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])

  test('it sends OTP to email and mobile when mobile is placed in payload.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const $response = await client.post(route('api.otp.forgot-password')).json({ mobile: user.mobile })
      $response.assertStatus(200)
      assert.notProperty($response.body(), 'errors')
      $response.assertBodyContains({ success: true, source: user.mobile, user: user.id })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.forgot-password'])
})
