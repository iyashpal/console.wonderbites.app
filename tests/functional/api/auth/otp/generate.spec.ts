import {test} from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import {UserFactory} from 'Database/factories'

test.group('API [otp.generate]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when authenticated user try to re-login.')
    .run(async ({client, route}) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.generate')).accept('json').guard('api').loginAs(user)

      response.assertStatus(401)
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 422 status code when mobile number is missing in request payload.')
    .run(async ({client, route}) => {
      const response = await client.post(route('api.otp.generate')).accept('json')

      response.assertStatus(422)
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 422 status code when the mobile number is not exists in database.')
    .run(async ({client, route}) => {
      await UserFactory.merge({mobile: '9882426384'}).create()

      const response = await client.post(route('api.otp.generate'))
        .json({mobile: '9882426385'})

      response.assertStatus(422)
      response.assertBodyContains({errors: {mobile: 'exists validation failure'}})
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 200 status code when user enters correct mobile number with existence in database.')
    .run(async ({client, route}) => {
      const user = await UserFactory.merge({mobile: '9882426384'}).create()

      const response = await client.post(route('api.otp.generate'))
        .json({mobile: user.mobile})

      response.assertStatus(200)
      response.assertBodyContains({success: true, user: user.id})
    }).tags(['@api', '@auth', '@api.otp.generate'])
})
