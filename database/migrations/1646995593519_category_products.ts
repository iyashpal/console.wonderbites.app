import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryProducts extends BaseSchema {
  protected tableName = 'category_products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('category_id').unsigned().notNullable().references('categories.id').onDelete('CASCADE')
      table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('CASCADE')
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
