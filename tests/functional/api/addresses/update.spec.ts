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

    const addressData = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.put(route('api.addresses.update', { id: 50 }))
      // @ts-ignore
      .guard('api').loginAs(user).json(addressData)

    request.assertStatus(404)

    request.assertBodyContains({ message: 'Page not found' })
  }).tags(['@addresses', '@addresses.update'])

  test('guest users are not allowed to update address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.put(route('api.addresses.update', address)).json(address.toJSON())

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  }).tags(['@addresses', '@addresses.update'])

  test('logged in users can update address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({ userId: user.id }).create()

    const addressData = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.put(route('api.addresses.update', address))
      // @ts-ignore
      .guard('api').loginAs(user).json(addressData)

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: addressData.firstName,
      last_name: addressData.lastName,
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      phone: addressData.phone,
    })

    const addressRequest = await client.get(route('api.addresses.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    addressRequest.assertStatus(200)

    addressRequest.assertBodyContains([
      {
        first_name: addressData.firstName,
        last_name: addressData.lastName,
        type: addressData.type,
        street: addressData.street,
        city: addressData.city,
        phone: addressData.phone,
      },
    ])
  }).tags(['@addresses', '@addresses.update'])

  test('updating existing address can be set as default.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({ userId: user.id }).create()

    const addressData = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.put(route('api.addresses.update', address))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...addressData, is_default: true })

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: addressData.firstName,
      last_name: addressData.lastName,
      type: addressData.type,
      street: addressData.street,
      city: addressData.city,
      phone: addressData.phone,
    })

    const userRequest = await client.get(route('api.users.auth', user))
      // @ts-ignore
      .guard('api').loginAs(user)

    userRequest.assertStatus(200)

    userRequest.assertBodyContains({ address_id: address.id })
  }).tags(['@addresses', '@addresses.update', '@users.auth'])
})
