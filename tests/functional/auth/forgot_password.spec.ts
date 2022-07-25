import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'

test.group('Auth forgot password', () => {
  test('Send password reset link', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('password.email'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ email: user.email }).accept('json')

    response.dumpBody()
  })
})
