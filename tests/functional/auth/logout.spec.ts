import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Auth logout', (group) => {
  /**
   * Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: Only authenticated user can logout from a session.
   * 
   * ✔ Needs a user.
   * ✔ POST request to `route('api.logout')` with api guard and authentication.
   * ✔ Request status should be OK.
   * ✔ Request response body should contain revoked field with value true.
   */
  test('Only authenticated user can logout from a session', async ({ client, route }) => {
    const user = await UserFactory.create()

    const response = await client.post(route('api.logout')).guard('api')
      .loginAs(user)

    response.assertStatus(200)
    response.assertBodyContains({ revoked: true })
  })

  /**
   * Case: Un-authenticated user cannot logout from a session.
   * 
   * ✔ POST request to `route('api.logout')` without api guard and authentication.
   * ✔ Request status should be Unauthenticated.
   * ✔ Request response body should contain message field with value 'Unauthenticated'.
   */
  test('Un-authenticated user cannot logout from a session', async ({ client, route }) => {
    const response = await client.post(route('api.logout')).accept('json')

    response.assertStatus(401)
    response.assertBodyContains({ message: 'Unauthorized access' })
  })
})
