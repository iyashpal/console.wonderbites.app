import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'
import { CategoryFactory } from 'Database/factories'

test.group('Api category show', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('A Guest user can see the list of categories.', async ({ client }) => {
    await CategoryFactory.createMany(5)

    const response = await client.get('/api/categories').accept('json')

    response.assert?.equal(5, response.body()?.length)
  })

  test('An authenticated user can see the list of categories too.', async ({ client }) => {
    // await CategoryFactory.createMany(5)

    // const user = await UserFactory.create()

    // const response = await client.get('/api/categories').loginAs(user).accept('json')

    // response.
  })
})
