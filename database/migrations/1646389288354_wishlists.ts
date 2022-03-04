import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wishlists extends BaseSchema {
  protected tableName = 'wishlists'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
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
