import { test } from '@japa/runner'
import Database from '@ioc:Adonis/Lucid/Database'

test.group('Api product', (group) => {
  /**
   * 🚀 Setup Global transaction for every test in this group.
   */
  group.each.setup(async () => {
    await Database.beginGlobalTransaction()
    return () => Database.rollbackGlobalTransaction()
  })
})
