import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MediaProducts extends BaseSchema {
  protected tableName = 'media_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('media_id').unsigned().notNullable().references('media.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('CASCADE')

      table.boolean('is_default').defaultTo(false)

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
