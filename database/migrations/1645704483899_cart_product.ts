import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartProduct extends BaseSchema {
  protected tableName = 'cart_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('cart_id').unsigned().notNullable().references('carts.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('CASCADE')

      table.integer('qty').unsigned().notNullable().defaultTo(1)

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
