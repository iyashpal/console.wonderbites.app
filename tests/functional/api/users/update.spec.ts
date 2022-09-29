import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [users.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow user to update their profile without first name.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      // @ts-ignore
      .guard('api').loginAs(user).json({ lastName: 'Pal' })

    $response.assertStatus(422)
    $response.assertBodyContains({ messages: { firstName: ['First name is required.'] } })
  })

  test('it cannot allow user to update their profile without last name.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      // @ts-ignore
      .guard('api').loginAs(user).json({ firstName: 'Yash' })

    $response.assertStatus(422)

    $response.assertBodyContains({ messages: { lastName: ['Last name is required.'] } })
  })

  test('it can allow user to update their profile.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      // @ts-ignore
      .guard('api').loginAs(user).json({ firstName: 'Yash', lastName: 'Pal' })

    $response.assertStatus(200)

    $response.assertBodyContains({ first_name: 'Yash', last_name: 'Pal' })
  }).tags(['@users', '@users.update'])
})
