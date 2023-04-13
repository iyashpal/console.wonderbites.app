import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.table('products', (table) => {
      table.boolean('is_popular').after('is_customizable').defaultTo(false)
    })
  }

  public async down () {
    this.schema.table('products', (table) => {
      table.dropColumn('is_popular')
    })
  }
}
