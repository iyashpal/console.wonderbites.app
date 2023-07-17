import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('API [users.destroy]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('It do not allow a guest user to delete a user.', async ({ route, client }) => {
    const user = await UserFactory.create()

    const $response = await client.delete(route('api.users.destroy', user))

    $response.assertStatus(401)
    $response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@api.users', '@api.users.destroy'])

  test('It do not allow a user to delete another user.', async ({ route, client }) => {
    const user = await UserFactory.create()

    const $response = await client.delete(route('api.users.destroy', user))

    $response.assertStatus(401)
    $response.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@api.users', '@api.users.destroy'])

  test('It throws 404 when the user is not exists.', async ({ route, client }) => {
    const user = await UserFactory.create()

    const $response = await client.delete(route('api.users.destroy', {id: 550})).guard('api').loginAs(user)
    $response.assertStatus(404)
  }).tags(['@api', '@api.users', '@api.users.destroy'])

  test('It allows a logged-in user to delete his own account.', async ({ route, client }) => {
    const user = await UserFactory.merge({}).create()

    const $response = await client.delete(route('api.users.destroy', user)).guard('api').loginAs(user)

    $response.assertStatus(200)
    $response.assertBodyContains({success: true})
  }).tags(['@api', '@api.users', '@api.users.destroy'])
})
