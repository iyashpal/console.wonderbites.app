import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory, UserFactory } from 'Database/factories'

test.group('API [addresses.destroy]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('guest users cannot delete address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const $response = await client.delete(route('api.addresses.destroy', address))

    $response.assertStatus(401)

    $response.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@addresses', '@addresses.destroy'])

  test('it allows users to delete their addresses.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({user_id: user.id}).create()

    const $response = await client.delete(route('api.addresses.destroy', address)).guard('api').loginAs(user)

    $response.assertStatus(200)

    $response.assertBodyContains({ deleted: true })
  }).tags(['@addresses', '@addresses.destroy'])

  test('it can not allow others to delete someone\'s address.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.with('user').create()

    const $response = await client.delete(route('api.addresses.destroy', address)).guard('api').loginAs(user)

    $response.assertStatus(403)

    $response.assertBodyContains({ name: 'AuthorizationException' })
  }).tags(['@addresses', '@addresses.destroy'])
})
