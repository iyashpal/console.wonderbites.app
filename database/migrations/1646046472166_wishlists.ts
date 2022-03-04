import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wishlists extends BaseSchema {
  protected tableName = 'wishlists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('product_id').unsigned()

      table.integer('user_id').nullable()
        .references('products.id').onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
