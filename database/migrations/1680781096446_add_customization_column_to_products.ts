import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.table('products', (table) => {
      table.boolean('is_customizable').after('published_at').defaultTo(true)
    })
  }

  public async down () {
    this.schema.table('products', (table) => {
      table.dropColumn('is_customizable')
    })
  }
}
