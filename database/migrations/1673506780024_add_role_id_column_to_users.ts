import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  public async up () {
    this.schema.table('users', (table) => {
      table.bigInteger('role_id').unsigned().nullable().after('id')
      table.foreign('role_id').references('roles.id').onDelete('CASCADE')
    })
  }

  public async down () {
    this.schema.table('users', (table) => {
      table.dropForeign('role_id')
    })
  }
}
