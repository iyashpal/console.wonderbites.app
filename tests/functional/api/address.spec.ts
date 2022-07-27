import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { string } from '@ioc:Adonis/Core/Helpers'
import { AddressFactory, UserFactory } from 'Database/factories'

test.group('Api address', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('[index] address list is not accessible to guest users.', async ({ client, route }) => {
    const request = await client.get(route('api.addresses.index'))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  })

  test('[index] address list is accessible to logged in users.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.addresses.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains([])
  })

  test('[index] It can list the addresses of logged in user.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const addresses = await AddressFactory.merge([
      { userId: user.id }, { userId: user.id }, { userId: user.id },
    ]).createMany(3)

    const request = await client.get(route('api.addresses.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains(addresses.map(({ id, userId, type }) => ({ id, user_id: userId, type })))
  })

  test('[show] it can see the address details of logged in user.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).create()

    const request = await client.get(route('api.addresses.show', address))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(200)

    request.assertBodyContains({ id: address.id, type: address.type })
  })

  test('[show] it can\'t see a non existing address details.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const request = await client.get(route('api.addresses.show', { id: 50 }))
      // @ts-ignore
      .guard('api').loginAs(user)

    request.assertStatus(404)

    request.assertBodyContains({ message: 'Page not found' })
  })

  test('[store] guest users are not allowed to create addresses.', async ({ client, route }) => {
    const address = await AddressFactory.make()

    const request = await client.post(route('api.addresses.store')).json(address.toJSON())

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  })

  test('[store] First name is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, firstName: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { firstName: ['First name is required'] },
    })
  })

  test('[store] First name length should be less than 255 characters.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, firstName: string.generateRandom(256) })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { firstName: ['Maximum 255 characters allowed only'] },
    })
  })

  test('[store] Last name is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, lastName: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { lastName: ['Last name is required'] },
    })
  })

  test('[store] Last name length should be less than 255 characters.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, lastName: string.generateRandom(256) })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { lastName: ['Maximum 255 characters allowed only'] },
    })
  })

  test('[store] Street is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, street: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { street: ['Street is required'] },
    })
  })

  test('[store] Street length should be less than 255 characters.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, street: string.generateRandom(256) })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { street: ['Maximum 255 characters allowed only'] },
    })
  })

  test('[store] City is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, city: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { city: ['City is required'] },
    })
  })

  test('[store] City length should be less than 255 characters.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, city: string.generateRandom(256) })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { city: ['Maximum 255 characters allowed only'] },
    })
  })

  test('[store] Phone is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, phone: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { phone: ['Phone is required'] },
    })
  })

  test('[store] Phone length should be less than 20 characters.', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, phone: string.generateRandom(21) })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { phone: ['Maximum 20 characters allowed only'] },
    })
  })

  test('[store] Phone is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, phone: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { phone: ['Phone is required'] },
    })
  })

  test('[store] Address type is required to create new address', async ({ client, route }) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, type: null })

    request.assertStatus(422)

    request.assertBodyContains({
      messages: { type: ['Address type is required'] },
    })
  })

  test('[store] logged in users can create validated address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json(address)

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: address.firstName,
      last_name: address.lastName,
      type: address.type,
      street: address.street,
      city: address.city,
      phone: address.phone,
    })

    const addressRequest = await client.get(route('api.addresses.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    addressRequest.assertStatus(200)

    addressRequest.assertBodyContains([
      {
        first_name: address.firstName,
        last_name: address.lastName,
        type: address.type,
        street: address.street,
        city: address.city,
        phone: address.phone,
      },
    ])
  })

  test('[store] Creating new address can be set as default.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.post(route('api.addresses.store'))
      // @ts-ignore
      .guard('api').loginAs(user).json({ ...address, is_default: true })

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: address.firstName,
      last_name: address.lastName,
      type: address.type,
      street: address.street,
      city: address.city,
      phone: address.phone,
    })

    const userRequest = await client.get(route('api.users.show', user))
      // @ts-ignore
      .guard('api').loginAs(user)

    userRequest.assertStatus(200)

    userRequest.assertBodyContains({ address_id: request.body().id })
  })

  test('[update] guest users are not allowed to update address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.put(route('api.addresses.update', address)).json(address.toJSON())

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  })

  test('[update] logged in users can update address.', async ({ client, route }) => {
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
  })

  test('[update] Updating existing address can be set as default.', async ({ client, route }) => {
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

    const userRequest = await client.get(route('api.users.show', user))
      // @ts-ignore
      .guard('api').loginAs(user)

    userRequest.assertStatus(200)

    userRequest.assertBodyContains({ address_id: address.id })
  })

  test('[show] it can\'t update a non existing address.', async ({ client, route }) => {
    const user = await UserFactory.create()

    const addressData = await AddressFactory.merge({ userId: user.id }).make()

    const request = await client.put(route('api.addresses.update', { id: 50 }))
      // @ts-ignore
      .guard('api').loginAs(user).json(addressData)

    request.assertStatus(404)

    request.assertBodyContains({ message: 'Page not found' })
  })

  test('[destroy] guest users cannot delete address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.delete(route('api.addresses.destroy', address))

    request.assertStatus(401)

    request.assertBodyContains({ message: 'Unauthenticated' })
  })

  test('[destroy] logged in users can delete address.', async ({ client, route }) => {
    const address = await AddressFactory.with('user').create()

    const request = await client.delete(route('api.addresses.destroy', address))
      // @ts-ignore
      .guard('api').loginAs(address.user)

    request.assertStatus(200)

    request.assertBodyContains({ deleted: true })
  })
})
