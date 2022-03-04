import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ProductImages extends BaseSchema {
  protected tableName = 'product_images'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('product_id').unsigned()
        .references('products.id').onDelete('CASCADE')

      table.text('image_path').nullable()

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
