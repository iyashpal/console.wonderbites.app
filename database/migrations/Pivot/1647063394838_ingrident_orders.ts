import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class IngridentOrder extends BaseSchema {
  protected tableName = 'ingrident_order'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('order_id').unsigned().notNullable().references('orders.id').onDelete('CASCADE')

      table.bigInteger('ingridient_id').unsigned().notNullable().references('ingridients.id').onDelete('CASCADE')

      table.bigInteger('order_product_id').unsigned().notNullable().references('order_product.id').onDelete('CASCADE')

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
