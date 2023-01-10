import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [users.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow unauthenticated users to update the profile.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))

    $response.assertStatus(401)
  })

  test('it can not allow user to update their profile without first name.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({ last_name: 'Pal' })

    $response.assertStatus(422)
    $response.assertBodyContains({ errors: { first_name: 'First name is required.' } })
  })

  test('it cannot allow user to update their profile without last name.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({ first_name: 'Yash' })

    $response.assertStatus(422)

    $response.assertBodyContains({ errors: { last_name: 'Last name is required.' } })
  })

  test('it can allow user to update their profile.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({ first_name: 'Yash', last_name: 'Pal' })

    $response.assertStatus(200)

    $response.assertBodyContains({ first_name: 'Yash', last_name: 'Pal' })
  }).tags(['@users', '@users.update'])
})
