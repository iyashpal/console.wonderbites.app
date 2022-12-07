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

    const request = await client.delete(route('api.addresses.destroy', address))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@addresses', '@addresses.destroy'])

  test('logged in users can delete address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.delete(route('api.addresses.destroy', address)).guard('api').loginAs(address.user)

    request.assertStatus(200)

    request.dumpBody()

    request.assertBodyContains({ deleted: true })
  }).tags(['@addresses', '@addresses.destroy'])

  test('it can not allow others to delete someone\'s address.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.with('user').create()

    const request = await client.delete(route('api.addresses.destroy', address)).guard('api').loginAs(user)

    // request.assertStatus(200)

    request.dumpBody()

    // request.assertBodyContains({ deleted: true })
  }).tags(['@addresses', '@addresses.destroy', '@addresses.debug'])
})
