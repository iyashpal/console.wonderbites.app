import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'
  public async up () {
    this.schema.table(this.tableName, (table) => {
      table.bigInteger('role_id').unsigned().nullable().after('id')
      table.foreign('role_id').references('roles.id').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table(this.tableName, (table) => {
      table.dropForeign('role_id')
    })
  }
}
