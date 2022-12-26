import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { UserFactory } from 'Database/factories'

test.group('Auth register', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: User cannot create account without his first name.
   * 
   * ✔ Need user information (having first_name field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'first_name'. 
   */
  test('User cannot create account without his first name', async ({ client, route }) => {
    const user = await UserFactory.merge({ firstName: '' }).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'firstName' }] })
  })

  /**
   * Case: User cannot create account without his last name.
   * 
   * ✔ Need user information (having last_name field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'last_name'. 
   */
  test('User cannot create account without his last name', async ({ client, route }) => {
    const user = await UserFactory.merge({ lastName: '' }).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'lastName' }] })
  })

  /**
   * Case: User cannot create account without email address.
   * 
   * ✔ Need user information (having email field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'email'. 
   */
  test('User cannot create account without email address', async ({ client, route }) => {
    const user = await UserFactory.merge({ email: '' }).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'email', message: 'Email address is required.' }] })
  })

  /**
   * Case: User cannot create account with an invalid email address.
   * 
   * ✔ Need user information (having email field value invalid/incorrect formatted email) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'email'. 
   */
  test('User cannot create account with an invalid email address', async ({ client, route }) => {
    const user = await UserFactory.merge({ email: 'infoexample.com' }).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'email', message: 'Enter a valid email.' }] })
  })

  /**
   * Case: User cannot create account without mobile.
   * 
   * ✔ Need user information (having mobile field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'mobile'. 
   */
  test('User cannot create account without mobile', async ({ client, route }) => {
    const user = await UserFactory.merge({ mobile: '' }).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'mobile' }] })
  })

  /**
   * Case: User cannot create account without password.
   * 
   * ✔ Need user information (having password field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'password'. 
   */
  test('User cannot create account without password', async ({ client, route }) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json(user.toJSON())

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'password' }] })
  })

  /**
   * Case: User cannot create account without confirming password.
   * 
   * ✔ Need user information (having password_confirmation field empty) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'password_confirmation'. 
   */
  test('User cannot create account without password', async ({ client, route }) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'password_confirmation' }] })
  })

  /**
   * Case: User cannot create account without matching password_confirmation.
   * 
   * ✔ Need user information (having password_confirmation field unmatched to password field) to create new account.
   * ✔ POST request to `route('api.register')` without api guard and authentication having user information in the body.
   * ✔ Request status shoud be Unprocessable (422)
   * ✔ Request response body should contain errors field 'password_confirmation'. 
   */
  test('User cannot create account without matching password_confirmation', async ({ client, route }) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json({ ...user.toJSON(), password: user.password, password_confirmation: 'testing' })

    response.assertStatus(422)

    response.assertBodyContains({ errors: [{ field: 'password_confirmation' }] })
  })

  /**
   * Case: An authenticated user cannot register new account.
   * 
   * ✔ Need user from database.
   * ✔ POST request to `route('api.register')` with api guard and authentication data.
   * ✔ Request response status should be Unauthorized (401)
   * ✔ Request response should contain message field with value 'unauthorized access'.
   */
  test('Authenticated user cannot register', async ({ client, route }) => {
    const User = await UserFactory.create()

    const response = await client.post(route('api.register')).guard('api')
      .loginAs(User)

    response.assertStatus(401)
    response.assertBodyContains({ message: 'unauthorized access' })
  })

  /**
   * Case: Guest users can easily register..
   * 
   * ✔ Need user information to create account.
   * ✔ POST request to `route('api.register')` without authentication having user data in the body.
   * ✔ Request status should be OK.
   * ✔ Request response should contain user information.
   */
  test('Guest users can easily register.', async ({ client, route }) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json').json({
      firstName: 'Yash',
      lastName: 'Pal',
      mobile: '0123456789',
      email: 'yash@brandsonify.com',
      password: user.password,
      password_confirmation: user.password,
    })

    response.assertStatus(200)

    response.assertBodyContains({
      first_name: 'Yash',
      last_name: 'Pal',
      mobile: '0123456789',
      email: 'yash@brandsonify.com',
    })
  })
})
