import { test } from '@japa/runner'

test.group('Api auth login', () => {
  test('Need email & password to login.', async ({ client }) => {
    const response = await client.post('/api/login').accept('json')

    response.assertStatus(422)

    response.assert?.containsSubset(response.body(), {
      errors: [{ field: 'email' }, { field: 'password' }],
    })
  })
})
