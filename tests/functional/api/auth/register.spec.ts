import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Auth register', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('User cannot create account without his first name', async ({client, route}) => {
    const user = await UserFactory.merge({firstName: ''}).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {first_name: 'First name is required.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without his last name', async ({client, route}) => {
    const user = await UserFactory.merge({lastName: ''}).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {last_name: 'Last name is required.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without email address', async ({client, route}) => {
    const user = await UserFactory.merge({email: ''}).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {email: 'Email address is required.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account with an invalid email address', async ({client, route}) => {
    const user = await UserFactory.merge({email: 'infoexample.com'}).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {email: 'Enter a valid email.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('It throws validation error when mobile number is set but area code id empty.')
    .run(async ({client, route}) => {
      const user = await UserFactory.merge({areaCode: ''}).make()

      const response = await client.post(route('api.register')).accept('json')

        .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

      response.assertStatus(422)

      response.assertBodyContains({errors: {area_code: 'requiredIfExists validation failed'}})
    }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without mobile', async ({client, route}) => {
    const user = await UserFactory.merge({mobile: ''}).make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {mobile: 'Mobile no. is required.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without password', async ({client, route}) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json(user.toJSON())

    response.assertStatus(422)

    response.assertBodyContains({errors: {password: 'Choose a password.'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without password confirmation.', async ({client, route}) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password})

    response.assertStatus(422)

    response.assertBodyContains({errors: {password_confirmation: 'confirmed validation failed'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('User cannot create account without match of password_confirmation', async ({client, route}) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json')

      .json({...user.toJSON(), password: user.password, password_confirmation: 'testing'})

    response.assertStatus(422)

    response.assertBodyContains({errors: {password_confirmation: 'confirmed validation failed'}})
  }).tags(['@api', '@auth', '@api.register'])

  test('Authenticated user cannot register', async ({client, route}) => {
    const User = await UserFactory.create()

    const response = await client.post(route('api.register'))
      .guard('api').loginAs(User)

    response.assertStatus(401)
    response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@auth', '@api.register'])

  test('Guest users can easily register.', async ({client, route}) => {
    const user = await UserFactory.make()

    const response = await client.post(route('api.register')).accept('json').json({
      first_name: 'Yash',
      last_name: 'Pal',
      area_code: '+91',
      mobile: '0123456789',
      email: 'yash@brandsonify.com',
      password: user.password,
      password_confirmation: user.password,
    })

    response.assertStatus(200)

    response.assertBodyContains({
      first_name: 'Yash',
      last_name: 'Pal',
      area_code: '+91',
      mobile: '0123456789',
      email: 'yash@brandsonify.com',
    })
  }).tags(['@api', '@auth', '@api.register'])
})
