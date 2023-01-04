import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { AddressFactory, UserFactory } from 'Database/factories'

test.group('API [addresses.update]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can\'t update a non existing address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const addressData = await AddressFactory.merge({ user_id: user.id }).make()

    const request = await client.put(route('api.addresses.update', { id: 50 }))
      .guard('api').loginAs(user).json(addressData)

    request.assertStatus(404)
  }).tags(['@addresses', '@addresses.update'])

  test('guest users are not allowed to update address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.put(route('api.addresses.update', address)).json(address.toJSON())

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@addresses', '@addresses.update'])

  test('it can not allow a user to update other\'s address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.with('user').create()

    const $response = await client.put(route('api.addresses.update', address))
      .guard('api').loginAs(user).json(address.toJSON())

    $response.assertStatus(403)
  }).tags(['@addresses', '@addresses.update'])

  test('it can allow logged in users to update address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({ user_id: user.id }).create()

    const addressData = await AddressFactory.merge({ user_id: user.id }).make()

    const $response = await client.put(route('api.addresses.update', address))
      .guard('api').loginAs(user).json(addressData)

    $response.assertStatus(200)

    $response.assertBodyContains({
      first_name: addressData.first_name,
      last_name: addressData.last_name,
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      phone: addressData.phone,
    })
  }).tags(['@addresses', '@addresses.update'])

  test('updating existing address can be set as default.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({ user_id: user.id }).create()

    const addressData = await AddressFactory.merge({ user_id: user.id }).make()

    const request = await client.put(route('api.addresses.update', address))
      .guard('api').loginAs(user).json({ ...addressData, is_default: true })

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: addressData.first_name,
      last_name: addressData.last_name,
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      phone: addressData.phone,
    })

    const userRequest = await client.get(route('api.users.auth', user))
      .guard('api').loginAs(user)

    userRequest.assertStatus(200)

    userRequest.assertBodyContains({ address_id: address.id })
  }).tags(['@addresses', '@addresses.update', '@users.auth'])
})
