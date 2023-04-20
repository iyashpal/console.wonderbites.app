import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'
import {UserFactory, VerificationCodeFactory} from 'Database/factories'

test.group('API [otp.login]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when logged in user try to re-login.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.login')).guard('api').loginAs(user)

      response.assertStatus(401)
    }).tags(['@api', '@auth', '@api.auth.otp', '@api.otp.login'])

  test('it reads 422 status code when request payload is empty.')
    .run(async ({client, route}) => {
      const response = await client.post(route('api.otp.login')).json({})

      response.assertStatus(422)
      response.assertBodyContains({
        errors: {
          token: 'required validation failed',
        },
      })
    }).tags(['@api', '@auth', '@api.auth.otp', '@api.otp.login'])

  test('it reads 422 status code when the token is invalid.')
    .run(async ({client, route}) => {
      const response = await client.post(route('api.otp.login'))
        .json({token: string.generateRandom(32)})

      response.assertStatus(422)
      response.assertBodyContains({errors: {token: 'exists validation failure'}})
    }).tags(['@api', '@auth', '@api.auth.otp', '@api.otp.login'])

  test('it reads 422 status code when state is not set to Login.')
    .run(async ({ client, route }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id }).create()

      const response = await client.post(route('api.otp.login')).json({token: code.token})

      response.assertStatus(422)
      response.assertBodyContains({errors: {token: 'Invalid token state'}})
    }).tags(['@api', '@auth', '@api.auth.otp', '@api.otp.login'])

  test('it reads 200 status code when token and token state is Login.')
    .run(async ({client, route, assert}) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id, state: 'Login' }).create()

      const response = await client.post(route('api.otp.login'))
        .json({ token: code.token})

      response.assertStatus(200)
      assert.properties(response.body(), ['type', 'token'])
    }).tags(['@api', '@auth', '@api.auth.otp', '@api.otp.login'])
})
