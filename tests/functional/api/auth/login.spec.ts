import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Api auth login', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('Need email|mobile & password to login.', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json')

    response.assertStatus(422)

    response.assert?.containsSubset(response.body(), {
      errors: [{ field: 'email' }, { field: 'password' }],
    })
  })

  test('Can\'t login without a password', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ email: 'info@example.com' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'password' }] })
  })

  test('Can\'t login without an email|mobile', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ password: 'Welcome@123!' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'email' }] })
  })
})
