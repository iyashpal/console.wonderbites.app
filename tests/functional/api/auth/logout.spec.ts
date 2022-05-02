import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Api auth logout', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })

  test('An authenticated user can\'t logout from a session', async ({ client }) => {

  })
})
