import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.date('date_of_birth').nullable().after('last_name')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('date_of_birth')
    })
  }
}
