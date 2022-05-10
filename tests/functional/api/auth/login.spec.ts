import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Api auth login', (group) => {
  /**
   * Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: User needs email OR mobile & password to login to the account.
   * 
   * Step 1: POST request hit to `route('api.login')` without fields.
   * Step 2: Request status should be Unprocessable Entity response.
   * Step 3: Validation response should contain error fields (email, password).
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
   * Step 1: POST request hit to `route('api.login')` with only email field.
   * Step 2: Request status should be Unprocessable Entity response.
   * Step 3: Validation response should contain error field (password).
   */
  test('User cannot login without a password', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ email: 'info@example.com' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'password' }] })
  })

  /**
   * Case: User cannot login without an email|mobile.
   * 
   * Step 1: POST request hit to `route('api.login')` with only password field.
   * Step 2: Request status should be Unprocessable Entity response.
   * Step 3: Validation response should contain error field (email).
   */
  test('User cannot login without an email|mobile', async ({ client, route }) => {
    const response = await client.post(route('api.login')).accept('json').fields({ password: 'Welcome@123!' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { errors: [{ field: 'email' }] })
  })

  /**
   * Case: User cannot login with incorrect email.
   * 
   * Step 1: POST request hit to `route('api.login')` with only password field.
   * Step 2: Request status should be Unprocessable Entity response.
   * Step 3: Validation response should contain error message ("Email does not exists.").
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
   * Step 1: Create user with UserFactory.
   * Step 2: POST request hit to `route('api.login')` with only password field.
   * Step 3: Request status should be Unprocessable Entity response.
   * Step 4: Validation response should contain error message ("Credentials not found.").
   */
  test('User cannot login with incorrect password', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'wrong-password' })

    response.assertStatus(422)
    response.assert?.containsSubset(response.body(), { message: 'Credentials not found.' })
  })

  /**
   * Case: User cannot login with incorrect password.
   * 
   * Step 1: Create user with UserFactory.
   * Step 2: POST request hit to `route('api.login')` with only password field.
   * Step 3: Request status should be OK.
   * Step 4: Request response should contain fields (type, token).
   */
  test('User can login with valid login details', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({ email: user.email, password: 'Welcome@123!' })

    response.assertStatus(200)
    response.assert?.containsSubset(response.body(), { type: 'bearer' })
  })
})
