import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('user_id').unsigned().references('users.id').notNullable().onDelete('CASCADE')

      table.string('first_name').notNullable()

      table.string('last_name').notNullable()

      table.string('street').notNullable()

      table.string('city').notNullable()

      table.string('phone').notNullable()

      table.string('email').nullable()

      table.json('location')

      table.string('type').notNullable().comment('Could be \'Home\', \'Office\', \'Other\'')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true }).notNullable()
      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
