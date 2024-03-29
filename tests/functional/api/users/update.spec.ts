import {test} from '@japa/runner'
import {UserFactory} from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [users.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not allow unauthenticated users to update the profile.', async ({client, route}) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))

    $response.assertStatus(401)
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it can not allow user to update their profile without first name.', async ({client, route}) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({last_name: 'Pal'})

    $response.assertStatus(422)
    $response.assertBodyContains({errors: {first_name: 'First name is required.'}})
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it cannot allow user to update their profile without last name.', async ({client, route}) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({first_name: 'Yash'})

    $response.assertStatus(422)

    $response.assertBodyContains({errors: {last_name: 'Last name is required.'}})
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it allows users to update their profile without entering the date of birth.', async ({client, route}) => {
    const user = await UserFactory.create()
    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({
        first_name: 'Yash',
        last_name: 'Pal',
      })

    $response.assertStatus(200)
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it throws validation error when the date of birth is not a valid date.', async ({client, route}) => {
    const user = await UserFactory.create()
    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({
        first_name: 'Yash',
        last_name: 'Pal',
        date_of_birth: '1992-25-25',
      })

    $response.assertStatus(422)
    $response.assertBodyContains({
      errors: {
        date_of_birth: 'you specified 25 (of type number) as a month, which is invalid',
      },
    })
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it throws validation error when the date of birth is not ISO parsable valid date.', async ({client, route}) => {
    const user = await UserFactory.create()
    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({
        first_name: 'Yash',
        last_name: 'Pal',
        date_of_birth: '1992-3-1',
      })

    $response.assertStatus(422)
    $response.assertBodyContains({
      errors: {
        date_of_birth: 'the input "1992-3-1" can\'t be parsed as ISO 8601',
      },
    })
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it do not throw validation error when the date of birth is a valid date.', async ({client, route}) => {
    const user = await UserFactory.create()
    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({
        first_name: 'Yash',
        last_name: 'Pal',
        date_of_birth: '1992-03-25',
      })

    $response.assertStatus(200)
    $response.assertBodyContains({
      date_of_birth: '1992-03-25',
    })
  }).tags(['@api', '@api.users', '@api.users.update'])

  test('it can allow user to update their profile.', async ({client, route}) => {
    const user = await UserFactory.create()

    const $response = await client.put(route('api.users.update', user))
      .guard('api').loginAs(user).json({first_name: 'Yash', last_name: 'Pal'})

    $response.assertStatus(200)

    $response.assertBodyContains({first_name: 'Yash', last_name: 'Pal'})
  }).tags(['@api', '@api.users', '@api.users.update'])
})
