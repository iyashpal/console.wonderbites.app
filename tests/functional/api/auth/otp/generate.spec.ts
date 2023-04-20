import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [otp.generate]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it reads 401 status code when authenticated user try to generate otp.')
    .run(async ({ client, route }) => {
      const user = await UserFactory.create()

      const response = await client.post(route('api.otp.generate')).accept('json').guard('api').loginAs(user)

      response.assertStatus(401)
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 422 status code when mobile number is missing in request payload.')
    .run(async ({ client, route }) => {
      const response = await client.post(route('api.otp.generate')).accept('json')

      response.assertStatus(422)
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 200 status code when the mobile number is not registered.')
    .run(async ({ client, route, assert }) => {
      await UserFactory.merge({ mobile: '9882426384' }).create()

      const response = await client.post(route('api.otp.generate'))
        .json({ source: '9882426385' })

      response.assertStatus(200)
      assert.notAllProperties(response.body(), ['user'])
      assert.properties(response.body(), ['success', 'source', 'token'])
      response.assertBodyContains({ success: true, source: '9882426385' })
    }).tags(['@api', '@auth', '@api.otp.generate'])

  test('it reads 200 status code with extra properties in response when mobile number is registered.')
    .run(async ({ client, route, assert }) => {
      const user = await UserFactory.merge({ mobile: '9882426384' }).create()

      const response = await client.post(route('api.otp.generate'))
        .json({ source: user.mobile })

      response.assertStatus(200)
      assert.properties(response.body(), ['user', 'success', 'source', 'token'])
      response.assertBodyContains({ success: true, user: user.id, source: user.mobile })
    }).tags(['@api', '@auth', '@api.otp.generate'])
})
