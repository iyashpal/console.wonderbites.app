import Database from '@ioc:Adonis/Lucid/Database'
import { test } from '@japa/runner'

test.group('Core [attributes.index]', (group) => {
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
})
