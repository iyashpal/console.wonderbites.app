import {test} from '@japa/runner'
import {string} from '@ioc:Adonis/Core/Helpers'
import Database from '@ioc:Adonis/Lucid/Database'
import {AddressFactory, UserFactory} from 'Database/factories'

test.group('API [addresses.store]', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('guest users are not allowed to create addresses.', async ({client, route}) => {
    const address = await AddressFactory.make()

    const request = await client.post(route('api.addresses.store')).json(address.toJSON())

    request.assertStatus(401)

    request.assertBodyContains({message: 'Unauthorized access'})
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('first name is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, firstName: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {firstName: 'First name is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('first name length should be less than 255 characters.', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, firstName: string.generateRandom(256)})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {firstName: 'Maximum 255 characters allowed only'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('last name is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, lastName: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {lastName: 'Last name is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('last name length should be less than 255 characters.', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, lastName: string.generateRandom(256)})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {lastName: 'Maximum 255 characters allowed only'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('street is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, street: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {street: 'Street is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('street length should be less than 255 characters.', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, street: string.generateRandom(256)})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {street: 'Maximum 255 characters allowed only'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('city is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, city: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {city: 'City is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('city length should be less than 255 characters.', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, city: string.generateRandom(256)})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {city: 'Maximum 255 characters allowed only'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('phone is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, phone: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {phone: 'Phone is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('phone length should be less than 20 characters.', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, phone: string.generateRandom(21)})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {phone: 'Maximum 20 characters allowed only'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('phone is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, phone: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {phone: 'Phone is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('address type is required to create new address', async ({client, route}) => {
    const user = await UserFactory.create()
    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, type: null})

    request.assertStatus(422)

    request.assertBodyContains({
      errors: {type: 'Address type is required'},
    })
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('logged in users can create validated address.', async ({client, route}) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.make()

    const request = await client.post(route('api.addresses.store'))
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
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])

  test('creating new address can be set as default.', async ({client, route}) => {
    const user = await UserFactory.create()

    const address = await AddressFactory.merge({userId: user.id}).make()

    const request = await client.post(route('api.addresses.store'))
      .guard('api').loginAs(user).json({...address, is_default: true})

    request.assertStatus(200)

    request.assertBodyContains({
      first_name: address.firstName,
      last_name: address.lastName,
      type: address.type,
      street: address.street,
      city: address.city,
      phone: address.phone,
    })

    const defaultAddress = request.body()

    const userRequest = await client.get(route('api.users.auth'))
      .guard('api').loginAs(user)

    userRequest.assertStatus(200)

    userRequest.assertBodyContains({address_id: defaultAddress.id})
  }).tags(['@api', '@api.addresses', '@api.addresses.store'])
})
