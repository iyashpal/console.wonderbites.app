import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory, VerificationCodeFactory } from 'Database/factories'

test.group('API [auth.otp.reset-password]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it do not allow access to an authenticated user', async ({ client, route }) => {
    const user = await UserFactory.create()
    const code = await VerificationCodeFactory.create()
    const $response = await client.post(route('api.otp.reset-password', code)).guard('api').loginAs(user)

    $response.assertStatus(401)
    $response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])

  test('it allows access to a guest user', async ({ client, route }) => {
    const user = await UserFactory.create()
    const code = await VerificationCodeFactory.merge({ userId: user.id, verifiedAt: null }).create()
    const $response = await client.post(route('api.otp.reset-password', code)).json({
      code: code.code,
      password: 'Help',
      password_confirmation: 'Help',
    })

    $response.assertStatus(200)
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])

  test('it throws validation error when the code is not valid', async ({ client, route, assert }) => {
    const user = await UserFactory.create()
    const code = await VerificationCodeFactory.merge({ userId: user.id }).create()
    const $response = await client.post(route('api.otp.reset-password', code)).json({
      code: code.code,
      password: 'Help',
      password_confirmation: 'Help',
    })

    $response.assertStatus(422)
    assert.properties($response.body().errors, ['code'])
    $response.assertBodyContains({ errors: { code: 'exists validation failure'} })
    assert.notAllProperties($response.body().errors, ['password', 'password_confirmation'])
  }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])

  test('it throws validation error when the code is valid but password field is missing.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id, verifiedAt: null }).create()
      const $response = await client.post(route('api.otp.reset-password', code)).json({
        code: code.code,
      })
      $response.assertStatus(422)
      assert.properties($response.body().errors, ['password'])
      assert.notAllProperties($response.body().errors, ['code', 'password_confirmation'])
      $response.assertBodyContains({ errors: { password: 'required validation failed'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])

  test('it throws validation error when the code is valid but password confirmation field is missing.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id, verifiedAt: null }).create()
      const $response = await client.post(route('api.otp.reset-password', code)).json({
        code: code.code,
        password: 'Welcome',
      })
      $response.assertStatus(422)
      assert.properties($response.body().errors, ['password_confirmation'])
      assert.notAllProperties($response.body().errors, ['code', 'password'])
      $response.assertBodyContains({ errors: { password_confirmation: 'confirmed validation failed'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])

  test('it updates the user password successfully.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id, verifiedAt: null }).create()
      const $response = await client.post(route('api.otp.reset-password', code)).json({
        code: code.code,
        password: 'Welcome',
        password_confirmation: 'Welcome',
      })

      $response.assertStatus(200)
      assert.notProperty($response.body(), 'errors')
      $response.assertBodyContains({success: true})

      const $login = await client.post(route('api.login')).accept('json').fields({
        email: user.email,
        password: 'Welcome',
      })

      $login.assertStatus(200)
      assert.notProperty($login.body(), 'errors')
      assert.properties($login.body(), ['type', 'token'])
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.reset-password'])
})
