import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Auth login', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User needs email|mobile & password to login.', async ({client, route}) => {
    const response = await client.post(route('api.login')).accept('json')

    response.assertStatus(422)

    response.assertBodyContains({
      errors: {email: 'Email address is required to login.', password: 'Enter password to login.'},
    })
  }).tags(['@api', '@auth', '@api.login'])

  test('User cannot login without a password', async ({client, route}) => {
    const response = await client.post(route('api.login'))
      .accept('json').fields({email: 'info@example.com'})

    response.assertStatus(422)
    response.assertBodyContains({errors: {password: 'Enter password to login.'}})
  }).tags(['@api', '@auth', '@api.login'])

  test('User cannot login without an email|mobile', async ({client, route}) => {
    const response = await client.post(route('api.login')).accept('json').fields({password: 'Welcome@123!'})

    response.assertStatus(422)
    response.assertBodyContains({errors: {email: 'Email address is required to login.'}})
  }).tags(['@api', '@auth', '@api.login'])

  test('User cannot login with incorrect email', async ({client, route}) => {
    const response = await client.post(route('api.login'))
      .json({email: 'info@example.com', password: 'Welcome@123!'})

    response.assertStatus(400)
    response.assertBodyContains({code: 'E_INVALID_AUTH_UID'})
  }).tags(['@api', '@auth', '@api.login'])

  test('User cannot login with incorrect password', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login'))
      .json({email: user.email, password: 'wrong-password'})
    response.assertStatus(400)
  }).tags(['@api', '@auth', '@api.login'])

  test('User can login with valid credentials', async ({client, route}) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.login')).accept('json')
      .fields({email: user.email, password: 'Welcome@123!'})

    response.assertStatus(200)
    response.assertBodyContains({type: 'bearer'})
  }).tags(['@api', '@auth', '@api.login'])
})
