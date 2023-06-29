import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.string('area_code').after('remember_me_token').notNullable().defaultTo('+355')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropColumn('area_code')
    })
  }
}
