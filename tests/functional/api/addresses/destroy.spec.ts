import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory } from 'Database/factories'

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

    request.assertBodyContains({ deleted: true })
  }).tags(['@addresses', '@addresses.destroy'])
})
