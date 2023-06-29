import {test} from '@japa/runner'

test.group('Helpers/Database/Input.ts', () => {
  test('it can extract the columns from a string.', async ({assert}) => {
    let [columns] = ('category.products:id,name,email').split(':').reverse()

    assert.equal(columns.split(',')[0], 'id')
  }).tags(['@unit', '@helpers', '@helpers.database', '@helpers.database.input'])
})
