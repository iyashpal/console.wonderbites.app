import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory, UserFactory } from 'Database/factories'

test.group('API [addresses.index]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('address list is not accessible to guest users.', async ({ client, route }) => {
    const request = await client.get(route('api.addresses.index'))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@addresses', '@addresses.index'])

  test('address list is accessible to logged in users.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.addresses.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains([])
  }).tags(['@addresses', '@addresses.index'])

  test('it can list the addresses of logged in user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const addresses = await AddressFactory.merge([
      { user_id: user.id }, { user_id: user.id }, { user_id: user.id },
    ]).createMany(3)

    const request = await client.get(route('api.addresses.index'))
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains(addresses.map(({ id, user_id, type }) => ({ id, user_id: user_id, type })))
  }).tags(['@addresses', '@addresses.index'])
})
