import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Carts extends BaseSchema {
  protected tableName = 'carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('RESTRICT')

      table.string('ip_address').nullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
<<<<<<< HEAD
      //table.integer('product_id').unsigned()
      table.integer('user_id').nullable()
        .references('users.id').onDelete('CASCADE')
      table.integer('qty').defaultTo(1)
      table.string('price').notNullable()
      table.string('device_token').notNullable()
      table.integer('status').defaultTo(1)
=======
>>>>>>> 42574a57503316e2da17efe7ca823b9c61e5a6a7
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
