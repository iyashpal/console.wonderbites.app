import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [users.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
  test('it reads 401 status code when the access token is missing.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.put(route('core.users.update', user))

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.update'])

  test('it reads 401 status code when user login with invalid role.', async ({client, route}) => {
    const user = await UserFactory.create()
    const response = await client.put(route('core.users.update', user)).guard('api').loginAs(user)
    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@core', '@core.users.update'])

  test('it reads 422 status code when user login with valid role and empty payload.', async ({client, route}) => {
    const user = await UserFactory.with('role').create()
    const response = await client.put(route('core.users.update', user)).guard('api').loginAs(user)

    response.assertStatus(422)
  }).tags(['@core', '@core.users.update'])

  test('it reads {code} status code when {situation}')
    .with([
      {
        situation: 'first_name is empty',
        field: 'first_name',
        value: '',
        code: 422,
        assert: {
          errors: {
            first_name: 'required validation failed',
          },
        },
      },
      {
        situation: 'last_name is empty',
        field: 'last_name',
        value: '',
        code: 422,
        assert: {
          errors: {
            last_name: 'required validation failed',
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
        situation: 'phone is empty',
        field: 'phone',
        value: '',
        code: 422,
        assert: {
          errors: {
            phone: 'required validation failed',
          },
        },
      },
      {
        situation: 'we pass valid phone number',
        field: 'phone',
        value: '+12025550184',
        code: 200,
        assert: {},
      },
      {
        situation: 'password is empty',
        field: 'password',
        value: '',
        code: 200,
        assert: {},
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
      {
        situation: 'when we send all details correctly.',
        field: '',
        value: '',
        code: 200,
        assert: {},
      },
    ])
    .run(async ({client, route}, field) => {
      const user = await UserFactory.with('role').create()
      const password = field.field === 'password' ? field.value : 'Welcome123'
      const response = await client.put(route('core.users.update', user)).guard('api').loginAs(user)
        .json({
          first_name: 'Yash',
          last_name: 'Pal',
          email: 'iyashpal.dev@gmail.com',
          phone: '+919882426384',
          password: password,
          password_confirmation: password,
          [field.field]: field.value,
        })

      response.assertStatus(field.code)
      if (field.assert) {
        response.assertBodyContains(field.assert)
      }
    }).tags(['@core', '@core.users.update'])

  test('it reads 422 status code when user try to change email that is already associated with other user.')
    .run(async ({client, route}) => {
      const user = await UserFactory.merge({email: 'yash@brandsonify.com'}).with('role').create()
      const subscriber = await UserFactory.create()
      const response = await client.put(route('core.users.update', subscriber)).guard('api').loginAs(user)
        .json({
          first_name: 'Yash',
          last_name: 'Pal',
          email: user.email,
          phone: '+919882426384',
          password: 'Welcome123',
          password_confirmation: 'Welcome123',
        })

      response.assertStatus(422)
      response.assertBodyContains({errors: {email: 'unique validation failure'}})
    }).tags(['@core', '@core.users.update'])
})
