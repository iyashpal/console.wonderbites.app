import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Addresses extends BaseSchema {
  protected tableName = 'addresses'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('user_id').unsigned()
        .references('users.id').notNullable().onDelete('CASCADE')

      table.string('first_name').notNullable()

      table.string('last_name').notNullable()

      table.string('street').notNullable()

      table.string('city').notNullable()

      table.string('phone').notNullable()

      table.string('type').notNullable().comment("Could be 'Home', 'Office', 'Other'")

      table.integer('status').nullable().defaultTo(0)

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
