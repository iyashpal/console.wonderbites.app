import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('type').defaultTo('General').after('price')
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
