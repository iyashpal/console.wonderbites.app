import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.table(this.tableName, (table) => {
      table.string('title').after('id').defaultTo('Untitled')
    })
  }

  public async down() {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('title')
    })
  }
}
