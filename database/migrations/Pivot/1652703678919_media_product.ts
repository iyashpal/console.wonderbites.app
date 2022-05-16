import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MediaProducts extends BaseSchema {
  protected tableName = 'media_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('media_id').references('media.id').onDelete('CASCADE')
      table.bigInteger('product_id').references('products.id').onDelete('CASCADE')
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
