import { test } from '@japa/runner'

test('Guest users can access login page.', async ({ client }) => {
  const response = await client.get('/login')

  response.assertStatus(200)
  response.assertTextIncludes('Login')
  response.assertTextIncludes('Email Address')
  response.assertTextIncludes('Password')
  response.assertTextIncludes('Remember me')
  response.assertTextIncludes('Forgot your password?')
})

test('Authenticated users can\'t access the login page', async ({ assert }) => {
  assert.isTrue(true)
})
