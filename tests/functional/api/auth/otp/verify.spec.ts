import { DateTime } from 'luxon'
import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'
import { UserFactory, VerificationCodeFactory } from 'Database/factories'

test.group('API > Auth [otp.verify]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when logged-in user try to verify the code.')
    .run(async ({ client, route }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.create()

      const response = await client.post(route('api.otp.verify', code)).guard('api').loginAs(user)

      response.assertStatus(401)
      response.assertBodyContains({ message: 'Unauthorized access' })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])

  test('it reads 422 status code when the code is missing from request payload.')
    .run(async ({ client, route}) => {
      const code = await VerificationCodeFactory.create()

      const response = await client.post(route('api.otp.verify', code)).json({})

      response.assertStatus(422)
      response.assertBodyContains({ errors: { code: 'required validation failed'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])

  test('it reads 422 status code when the code is not exists in the database.')
    .run(async ({ client, route}) => {
      const code = await VerificationCodeFactory.create()

      const response = await client.post(route('api.otp.verify', code)).json({code: '4568'})

      response.assertStatus(422)
      response.assertBodyContains({ errors: { code: 'exists validation failure'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])

  test('it reads 422 status code when the verification token is wrong.')
    .run(async ({ client, route}) => {
      const code = await VerificationCodeFactory.create()

      const response = await client.post(route('api.otp.verify', { token: string.generateRandom(32) }))
        .json({ code: code.code })

      response.assertStatus(422)
      response.assertBodyContains({ errors: {code: 'OTP is invalid'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])

  test('it reads 422 status code when the verification token is already verified.')
    .run(async ({ client, route}) => {
      const code = await VerificationCodeFactory.create()

      const response = await client.post(route('api.otp.verify', { token: code.token }))
        .json({ code: code.code })

      response.assertStatus(422)
      response.assertBodyContains({ errors: {code: 'OTP is invalid'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])

  test('it reads 422 status code when the code is expired.')
    .run(async ({ client, route}) => {
      const code = await VerificationCodeFactory.merge({
        verifiedAt: null, expiresAt: DateTime.now().minus({ minutes: 10 }),
      }).create()

      const response = await client.post(route('api.otp.verify', { token: code.token }))
        .json({ code: code.code })

      response.assertStatus(422)
      response.assertBodyContains({ errors: {code: 'OTP has been expired'} })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.verify'])
})
