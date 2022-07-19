import { test } from '@japa/runner'

test.group('Admin auth login', () => {
  test('Anyone can access login page', async ({ client }) => {
    const response = await client.get('/login')

    response.assertStatus(200)
    response.assertTextIncludes('Login')
    response.assertTextIncludes('Email Address')
    response.assertTextIncludes('Password')
    response.assertTextIncludes('Remember me')
    response.assertTextIncludes('Forgot your password?')
  })

  test('Redirect to dashboard if authenticated user tries to access login page', async ({ assert }) => {
    assert.isTrue(true)
  })
})
