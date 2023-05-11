import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.boolean('is_customizable').after('thumbnail').defaultTo(true)
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('is_customizable')
    })
  }
}
