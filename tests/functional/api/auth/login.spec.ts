import { test } from '@japa/runner'

test.group('Api auth login', () => {
  test('Users can\'t login without login credentials.', async ({ client }) => {
    const response = await client.get('api/login').json({
      email: 'user@wonderbites.com',
      password: 'secret',
    })

    console.log(response.status())
  })
})
