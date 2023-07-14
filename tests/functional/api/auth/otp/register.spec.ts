import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'
import { UserFactory, VerificationCodeFactory } from 'Database/factories'

test.group('API > Auth [otp.register]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when logged in user try to register.')
    .run(async ({ client, route }) => {
      const user = await UserFactory.create()
      const response = await client.post(route('api.otp.register')).guard('api').loginAs(user)

      response.assertStatus(401)
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])

  test('it reads 422 status code when request payload is empty.')
    .run(async ({ client, route }) => {
      const response = await client.post(route('api.otp.register')).json({})

      response.assertStatus(422)
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])

  test('it reads 422 status code when the token is invalid.')
    .run(async ({ client, route }) => {
      const response = await client.post(route('api.otp.register'))
        .json({ token: string.generateRandom(32) })

      response.assertStatus(422)
      response.assertBodyContains({ errors: { token: 'exists validation failure' } })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])

  test('it reads {code} status code when {situation}')
    .with([
      {
        situation: 'firstName is empty',
        field: 'firstName',
        value: '',
        code: 422,
        assert: {
          errors: {
            firstName: 'required validation failed',
          },
        },
      },
      {
        situation: 'lastName is empty',
        field: 'lastName',
        value: '',
        code: 422,
        assert: {
          errors: {
            lastName: 'required validation failed',
          },
        },
      },
      {
        situation: 'email is empty',
        field: 'email',
        value: '',
        code: 422,
        assert: {
          errors: {
            email: 'required validation failed',
          },
        },
      },
      {
        situation: 'mobile is empty',
        field: 'mobile',
        value: '',
        code: 422,
        assert: {
          errors: {
            mobile: 'required validation failed',
          },
        },
      },
      {
        situation: 'we pass valid phone number',
        field: 'mobile',
        value: '+12025550184',
        code: 200,
        assert: {},
      },
      {
        situation: 'password is empty',
        field: 'password',
        value: '',
        code: 422,
        assert: {
          errors: {
            password: 'required validation failed',
          },
        },
      },
      {
        situation: 'password length is less than 8',
        field: 'password',
        value: 'abc',
        code: 422,
        assert: {
          errors: {
            password: 'minLength validation failed',
          },
        },
      },
      {
        situation: 'password do not match',
        field: 'password_confirmation',
        value: 'Welcome1233',
        code: 422,
        assert: {
          errors: {
            password_confirmation: 'confirmed validation failed',
          },
        },
      },
    ])
    .run(async ({ client, route }, field) => {
      const user = await UserFactory.create()
      const password = field.field === 'password' ? field.value : 'Welcome123'
      const code = await VerificationCodeFactory.merge({ userId: user.id, state: 'Register' }).create()
      const response = await client.post(route('api.otp.register')).json({
        token: code.token,
        firstName: 'Yash',
        lastName: 'Pal',
        email: 'iyashpal.dev@gmail.com',
        mobile: '+12025550184',
        password: password,
        password_confirmation: password,
        [field.field]: field.value,
      })

      response.assertStatus(field.code)
      if (field.assert) {
        response.assertBodyContains(field.assert)
      }
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])

  test('it reads 422 status code when state is not set to Register.')
    .run(async ({ client, route }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id }).create()

      const response = await client.post(route('api.otp.register')).json({
        token: code.token,
        firstName: 'Yash',
        lastName: 'Pal',
        email: 'iyashpal.dev@gmail.com',
        mobile: '+919882426384',
        password: 'Welcome123',
        password_confirmation: 'Welcome123',
      })

      response.assertStatus(422)
      response.assertBodyContains({ errors: { token: 'Invalid token state' } })
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])

  test('it reads 200 status code when token and form data is valid with correct token state.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.create()
      const code = await VerificationCodeFactory.merge({ userId: user.id, state: 'Register' }).create()

      const response = await client.post(route('api.otp.register'))
        .json({
          token: code.token,
          firstName: 'Yash',
          lastName: 'Pal',
          email: 'iyashpal.dev@gmail.com',
          mobile: '+919882426384',
          password: 'Welcome123',
          password_confirmation: 'Welcome123',
        })

      response.assertStatus(200)
      assert.properties(response.body(), ['type', 'token'])
    }).tags(['@api', '@auth', '@api.otp', '@api.otp.register'])
})
