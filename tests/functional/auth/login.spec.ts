import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Auth login', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: User needs email OR mobile & password to login to the account.
   * 
   * ✔ POST request to `route('api.login')` without body.
   * ✔ Request status should be Unprocessable Entity response.
   * ✔ Response should contain error fields (email, password).
   */
  test('User needs email|mobile & password to login.', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json')

    response.assertStatus(422)

    response.assert?.containsSubset(response.body(), {
      errors: [{ field: 'email' }, { field: 'password' }],
    })
  })

  /**
   * Case: User cannot login without a password.
   * 
   * ✔ POST request to `route('api.login')` with only email in the body.
   * ✔ Request status should be Unprocessable Entity response.
   * ✔ Validation response should contain error field (password).
   */
  test('User cannot login without a password', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ email: 'info@example.com' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'password' }] })
  })

  /**
   * Case: User cannot login without an email|mobile.
   * 
   * ✔ POST request hit to `route('api.login')` with only password in the body.
   * ✔ Request status should be Unprocessable Entity response.
   * ✔ Validation response should contain error field (email).
   */
  test('User cannot login without an email|mobile', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ password: 'Welcome@123!' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'email' }] })
  })

  /**
   * Case: User cannot login with incorrect email.
   * 
   * ✔ POST request to `route('api.login')` with incorrect email & password.
   * ✔ Request status should be Unprocessable Entity response.
   * ✔ Validation response should contain error message ("Email does not exists.").
   */
  test('User cannot login with incorrect email', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json')

      .fields({ email: 'info@example.com', password: 'Welcome@123!' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ message: 'Email does not exists.' }] })
  })

  /**
   * Case: User cannot login with incorrect password.
   * 
   * ✔ Needs a user.
   * ✔ POST request to `route('api.login')` with user's email & a wrong password.
   * ✔ Request status should be Unprocessable Entity response.
   * ✔ Validation response should contain error message ("Credentials not found.").
   */
  test('User cannot login with incorrect password', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'wrong-password' })

    response.assertStatus(400)

    response.assertBodyContains({
      errors: [{
        field: 'password', message: 'Password do not match.',
      }],
    })

    // response.assert?.containsSubset(response.body(), { message: 'Credentials not found.' })
  })

  /**
   * Case: User can login with valid credencials.
   * 
   * ✔ Needs a user.
   * ✔ POST request to `route('api.login')` with user's email & password in the body.
   * ✔ Request status should be OK.
   * ✔ Request response should contain fields (type, token).
   */
  test('User can login with valid credencials', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'Welcome@123!' })

    response.assertStatus(200)
    response.assertBodyContains({ type: 'bearer' })
  })
})
