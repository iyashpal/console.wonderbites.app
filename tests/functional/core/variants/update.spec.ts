import { test } from '@japa/runner'
import { UserFactory } from 'Database/factories'
import Database from '@ioc:Adonis/Lucid/Database'
import { VariantFactory } from 'Database/factories'

test.group('Core [variants.update]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('it can not access the url without authentication.', async ({ client, route }) => {
    const $variant = await VariantFactory.create()
    const $response = await client.put(route('core.variants.update', $variant))

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.variants.update'])

  test('it can not access the url without auth role.', async ({ client, route }) => {
    const $user = await UserFactory.create()
    const $variant = await VariantFactory.create()
    const $response = await client.put(route('core.variants.update', $variant)).guard('api').loginAs($user)

    $response.assertStatus(401)
    $response.assertBodyContains({ message: 'Unauthorized access' })
  }).tags(['@core', '@core.variants.update'])

  test('it throws 404 status code when the variant is not exists.', async ({ client, route }) => {
    const $user = await UserFactory.with('role').create()
    const $payload = {
      name: 'Demo Name',
      description: 'Demo description...',
      proteins: '5',
      vegetables: '3',
      price: '500',
    }

    const $response = await client.put(route('core.variants.update', {id: 100}))
      .guard('api').loginAs($user).json($payload)

    $response.assertStatus(404)
  }).tags(['@core', '@core.variants.update'])

  test('it can access the url with valid auth role.', async ({ client, route }) => {
    const $variant = await VariantFactory.create()
    const $user = await UserFactory.with('role').create()
    const $payload = {
      name: 'Demo Name',
      description: 'Demo description...',
      proteins: '5',
      vegetables: '3',
      price: '500',
    }

    const $response = await client.put(route('core.variants.update', $variant))
      .guard('api').loginAs($user).json($payload)

    $response.assertStatus(200)
  }).tags(['@core', '@core.variants.update'])

  test('it will receive the validation error for the field {field}.')
    .with([
      { field: 'product_id', value: 0, expect: 'exists validation failure' },
      { field: 'name', value: null, expect: 'required validation failed' },
      { field: 'price', value: null, expect: 'required validation failed' },
    ]).run(async ({ client, route }, { field, value, expect }) => {
      const $variant = await VariantFactory.create()
      const $user = await UserFactory.with('role').create()
      const $payload = {
        name: 'Demo Name',
        description: 'Demo description...',
        price: '600',
        proteins: '5',
        vegetables: '6',
        [field]: value,
      }

      const $response = await client.put(route('core.variants.update', $variant))
        .guard('api').loginAs($user).json($payload)

      $response.assertStatus(422)
      $response.assertBodyContains({ errors: { [field]: expect } })
    }).tags(['@core', '@core.variants.update'])

  test('it can store the variant without the field "{field}".')
    .with([
      { field: 'description', value: '' },
    ])
    .run(async ({ client, route, assert }, { field, value }) => {
      const $variant = await VariantFactory.create()
      const $user = await UserFactory.with('role').create()
      const $payload = {
        name: 'Demo Name',
        description: 'Demo description...',
        price: '600',
        proteins: '5',
        vegetables: '6',
        [field]: value,
      }

      const $response = await client.put(route('core.variants.update', $variant))
        .guard('api').loginAs($user).json($payload)

      $response.assertStatus(200)
      assert.properties($response.body(), ['id', 'name', 'price'])
    })
})
