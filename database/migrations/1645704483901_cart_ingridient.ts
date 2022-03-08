import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartIngridient extends BaseSchema {
  protected tableName = 'cart_ingridient'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('cart_id').unsigned().notNullable().references('carts.id').onDelete('CASCADE')

      table.bigInteger('ingridient_id').unsigned().notNullable().references('ingridients.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('CASCADE')

      table.integer('qty').notNullable().defaultTo(1)

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
