import {DateTime} from 'luxon'
import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {UserFactory, VerificationCodeFactory} from 'Database/factories'

test.group('API [otp.login]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when authenticated user try to re-login.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.login')).guard('api').loginAs(user)

      response.assertStatus(401)
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when request payload is empty.')
    .run(async ({client, route}) => {
      const response = await client.post(route('api.otp.login')).json({})

      response.assertStatus(422)
      response.assertBodyContains({
        errors: {
          code: 'required validation failed',
          userId: 'required validation failed',
        },
      })
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when user is missing in payload.')
    .run(async ({client, route}) => {
      const response = await client.post(route('api.otp.login'))
        .json({code: 'DEMO'})

      response.assertStatus(422)
      response.assertBodyContains({errors: {userId: 'required validation failed'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when code is missing in payload.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id})

      response.assertStatus(422)
      response.assertBodyContains({errors: {code: 'required validation failed'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when code is invalid.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id, code: 'CODE'})

      response.assertStatus(422)
      response.assertBodyContains({errors: {code: 'OTP is invalid'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when code is invalid.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id, code: 'CODE'})

      response.assertStatus(422)
      response.assertBodyContains({errors: {code: 'OTP is invalid'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when code is expired but not verified.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const code = await VerificationCodeFactory.merge({
        userId: user.id, expiresAt: DateTime.now().minus({hour: 1}), verifiedAt: null,
      }).create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id, code: code.code})

      response.assertStatus(422)
      response.assertBodyContains({errors: {code: 'OTP has been expired'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 422 status code when code is already verified.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const code = await VerificationCodeFactory.merge({
        userId: user.id, verifiedAt: DateTime.now(),
      }).create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id, code: code.code})

      response.assertStatus(422)
      response.assertBodyContains({errors: {code: 'OTP is invalid'}})
    }).tags(['@api', '@auth', '@api.otp.login'])

  test('it reads 200 status code when code is valid and not expired.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const code = await VerificationCodeFactory.merge({
        userId: user.id, verifiedAt: null,
      }).create()

      const response = await client.post(route('api.otp.login'))
        .json({userId: user.id, code: code.code})

      response.assertStatus(200)
      response.assertBodyContains({type: 'bearer'})
    }).tags(['@api', '@auth', '@api.otp.login'])
})
