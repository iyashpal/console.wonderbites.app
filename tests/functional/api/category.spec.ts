import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'
import { CategoryFactory, MediaFactory, ProductFactory, UserFactory } from 'Database/factories'

test.group('Api category show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  /**
   * Case: Users that are not logged in can also access the category list.
   * 
   * ✔ Need some categories.
   * ✔ Fetch list of category via api endpoint.
   * ✔ Request status.
   * ✔ Validate categories count.
   * ✔ Look specific set of data in response body.
   * 
   */
  test(' A Guest user can see the list of categories.', async ({ client, assert }) => {
    const categories = await CategoryFactory.createMany(5)

    const response = await client.get('/api/categories').accept('json')

    response.assertStatus(200)

    response.assert?.equal(5, response.body()?.length)

    assert.containsSubset(response.body(), categories.map(({ id, type, name }) => ({ id, type, name })))
  })

  /**
   * Case: Users that are logged in can also access the category list.
   */
  test('An authenticated user can see the list of categories too.', async ({ client, assert }) => {
    const categories = await CategoryFactory.createMany(5)

    const user = await UserFactory.create()

    const response = await client.get('/api/categories').loginAs(user).accept('json')

    response.assertStatus(200)

    response.assert?.equal(5, response.body()?.length)

    assert.containsSubset(response.body(), categories.map(({ id, type, name }) => ({ id, type, name })))
  })

  /**
   * Case: Each category should contain the list of products under it.
   * 
   * 
   */
  test('Category list should contain the list of products under it.', async ({ client, route }) => {
    const category = await CategoryFactory.create()
    const product = await ProductFactory.create()

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

  /**
   * Case: A list of products under a category should contain the media files too.
   * 
   */
  test('Category products list should contain the list of media under it.', async ({ client, route }) => {
    const category = await CategoryFactory.create()
    const product = await ProductFactory.create()
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
