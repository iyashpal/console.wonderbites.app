import { test } from '@japa/runner'

test.group('Helpers/Database/Input.ts', () => {
  test('it can extract the columns from a string.', async () => {
    let [columns] = ('category.products:id,name,email').split(':').reverse()

    console.log(columns.split(','))
  }).tags(['@unit', '@helpers', '@helpers.database', '@helpers.database.input'])
})
