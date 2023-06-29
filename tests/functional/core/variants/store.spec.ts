import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Core [variants.store]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not access the url without authentication', async ({ client, route }) => {
    const $response = await client.post(route('core.variants.store'))

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.variants.store'])

  test('it can not access the url without auth role.', async ({ client, route }) => {
    const $user = await UserFactory.create()
    const $response = await client.post(route('core.variants.store')).guard('api').loginAs($user)

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.variants.store'])

  test('it can access the url with valid auth role.', async ({ client, route }) => {
    const $user = await UserFactory.with('role').create()
    const $payload = {
      name: 'Demo Name',
      description: 'Demo description...',
      proteins: '5',
      vegetables: '3',
      price: '500',
    }

    const $response = await client.post(route('core.variants.store'))
      .guard('api').loginAs($user).json($payload)

    $response.assertStatus(200)
  }).tags(['@core', '@core.variants.store'])

  test('it will receive the validation error for the field {field}')
    .with([
      { field: 'product_id', value: 0, expect: 'exists validation failure' },
      { field: 'name', value: null, expect: 'required validation failed' },
      { field: 'price', value: null, expect: 'required validation failed' },
    ]).run(async ({ client, route }, { field, value, expect }) => {
      const $user = await UserFactory.with('role').create()
      const $payload = {
        name: 'Demo Name',
        description: 'Demo description...',
        price: '600',
        proteins: '5',
        vegetables: '6',
        [field]: value,
      }

      const $response = await client.post(route('core.variants.store'))
        .guard('api').loginAs($user).json($payload)

      $response.assertStatus(422)
      $response.assertBodyContains({ errors: { [field]: expect } })
    }).tags(['@core', '@core.variants.store'])
  test('it can store the variant without the field "{field}"')
    .with([
      { field: 'description', value: '' },
    ])
    .run(async ({ client, route, assert }, { field, value }) => {
      const $user = await UserFactory.with('role').create()
      const $payload = {
        name: 'Demo Name',
        description: 'Demo description...',
        price: '600',
        proteins: '5',
        vegetables: '6',
        [field]: value,
      }

      const $response = await client.post(route('core.variants.store'))
        .guard('api').loginAs($user).json($payload)

      $response.assertStatus(200)
      assert.properties($response.body(), ['id', 'name', 'description', 'price'])
    })
})
