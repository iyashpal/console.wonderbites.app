import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory, UserFactory } from 'Database/factories'

test.group('API [addresses.show]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can see the address details of logged in user.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ user_id: user.id }).create()

    const request = await client.get(route('api.addresses.show', address))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: address.id, type: address.type })
  }).tags(['@addresses', '@addresses.show'])

  test('it can\'t see a non existing address details.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.addresses.show', { id: 50 }))
      .guard('api').loginAs(user)

    request.assertStatus(404)
  }).tags(['@addresses', '@addresses.show'])

  test('it can not allow a user to see other\'s address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.with('user').create()

    const request = await client.get(route('api.addresses.show', address))
      .guard('api').loginAs(user)

    request.assertStatus(403)
  }).tags(['@addresses', '@addresses.show'])
})
