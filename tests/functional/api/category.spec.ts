import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, MediaFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('Api category show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('All users can see the list of categories.', async ({ client, route, assert }) => {
    const user = await UserFactory.create()

    const categories = await CategoryFactory.createMany(5)

    const guestRequest = await client.get(route('api.categories.index')).accept('json')

    guestRequest.assertStatus(200)

    guestRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(guestRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))

    const authRequest = await client.get(route('api.categories.index'))
      // @ts-ignore
      .guard('api').loginAs(user)

    authRequest.assertStatus(200)

    authRequest.assert?.equal(5, guestRequest.body()?.length)

    assert.containsSubset(authRequest.body(), categories.map(({ id, type, name }) => ({ id, type, name })))
  })

  test('Category list should contain the list of products under it.', async ({ client, route }) => {
    const product = await ProductFactory.create()

    const category = await CategoryFactory.create()

    await category.related('products').attach([product.id])

    const request = await client.get(route('api.categories.index'))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
        },
      ],
    }])
  })

  test('Category products list should contain the list of media under it.', async ({ client, route }) => {
    const product = await ProductFactory.create()
    const category = await CategoryFactory.create()
    const media = await MediaFactory.createMany(5)

    product.related('media').attach(media.map(({ id }) => id))

    await category.related('products').attach([product.id])

    const request = await client.get(route('api.categories.index'))

    request.assertStatus(200)

    request.assertBodyContains([{
      id: category.id,
      name: category.name,
      products: [
        {
          id: product.id,
          name: product.name,
          media: media.map(
            ({ id, title, caption, filePath }) => ({ id, title, caption, file_path: filePath })
          ),
        },
      ],
    }])
  })
})
