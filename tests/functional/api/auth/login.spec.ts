import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Api auth login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User needs email|mobile & password to login.', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json')

    response.assertStatus(422)

    response.assert?.containsSubset(response.body(), {
      errors: [{ field: 'email' }, { field: 'password' }],
    })
  })

  test('User cannot login without a password', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ email: 'info@example.com' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'password' }] })
  })

  test('User cannot login without an email|mobile', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ password: 'Welcome@123!' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'email' }] })
  })

  test('User cannot login with incorrect email', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json')

      .fields({ email: 'info@example.com', password: 'Welcome@123!' })

    response.assert?.containsSubset(response.body(), { errors: [{ message: 'Email does not exists.' }] })
  })

  test('User cannot login with incorrect password', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'wrong-password' })

    response.assert?.containsSubset(response.body(), { message: 'Credentials not found.' })
  })

  test('User can login with valid login details', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'Welcome@123!' })

    response.assert?.containsSubset(response.body(), { type: 'bearer' })
  })
})
