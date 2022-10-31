import { test } from '@japa/runner'
import Mail from '@ioc:Adonis/Addons/Mail'
import { UserFactory } from 'Database/factories'

test.group('Auth forgot password', () => {
  test('Logged in users can not request the password reset link.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const response = await client.post(route('api.password.email'))
      .guard('api').loginAs(user).json({ email: user.email }).accept('json')

    response.assertBodyContains({ message: 'unauthorized access' })
  })

  test('Cannot request password reset link without an email address.', async ({ client, route }) => {
    const response = await client.post(route('api.password.email')).json({}).accept('json')

    response.assertBodyContains({
      errors: [
        { rule: 'required', field: 'email', message: 'Email address is required.' },
      ],
    })
  })

  test('Entered email should be a valid email address.', async ({ client, route }) => {
    const response = await client.post(route('api.password.email')).json({ email: 'test' }).accept('json')

    response.assertBodyContains({
      errors: [
        { rule: 'email', field: 'email', message: 'Enter a valid email address.' },
      ],
    })
  })

  test('Email that is not registered can not request password reset link.', async ({ client, route }) => {
    const response = await client.post(route('api.password.email')).json({ email: 'info@example.com' }).accept('json')

    response.assertBodyContains({
      errors: [
        { rule: 'exists', field: 'email', message: 'Email does not exists.' },
      ],
    })
  })

  test('Registered email address can request password reset link.', async ({ client, route, assert }) => {
    const mailer = Mail.fake(['smtp'])
    const user = await UserFactory.create()

    const response = await client.post(route('api.password.email')).json({ email: user.email }).accept('json')

    assert.isTrue(mailer.exists((mail) => mail.subject === 'Reset Password Notification'))

    response.assertBodyContains({ success: true })
  })
})
