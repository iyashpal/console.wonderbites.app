import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wishlists extends BaseSchema {
  protected tableName = 'wishlists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
<<<<<<< HEAD:database/migrations/1646389288354_wishlists.ts
=======

      table.integer('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

      table.string('ip_address').nullable()

>>>>>>> 42574a57503316e2da17efe7ca823b9c61e5a6a7:database/migrations/1646046472166_wishlists.ts
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
       table.integer('user_id').notNullable()
       table.integer('product_id').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
