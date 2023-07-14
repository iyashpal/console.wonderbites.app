import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import {string} from '@ioc:Adonis/Core/Helpers'

test.group('API [login]', (group) => {
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
      errors: {
        email: 'requiredIfNotExists validation failed',
        mobile: 'requiredIfNotExists validation failed',
        password: 'Enter password to login.',
      },
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
    response.assertBodyContains({
      errors: {
        email: 'requiredIfNotExists validation failed',
        mobile: 'requiredIfNotExists validation failed',
      },
    })
  }).tags(['@api', '@auth', '@api.login'])

  test('User cannot login with incorrect email', async ({client, route, assert}) => {
    const response = await client.post(route('api.login'))
      .json({email: `${string.generateRandom(10)}@example.com`, password: 'Welcome@123!'})
    response.assertStatus(422)
    response.assertBodyContains({ errors: { email: 'exists validation failure'} })
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

  test('it supports login brute force protection.').run(async ({client, route}) => {
    const email = `${string.generateRandom(5)}@example.com`
    await UserFactory.merge({email}).create()

    // const body = {email, password: 'secret'}

    // const request = async (body: { [key: string]: string }) => {
    //   return await client.post(route('api.login')).json(body)
    // }

    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(400);
    // (await request(body)).assertStatus(429)
  }).tags(['@api', '@auth', '@api.login', '@api.login.throttle'])
})
