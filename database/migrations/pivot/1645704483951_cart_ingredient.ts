import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'cart_ingredient'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('cart_id').unsigned().notNullable().references('carts.id').onDelete('CASCADE')

      table.bigInteger('ingredient_id').unsigned().notNullable().references('ingredients.id').onDelete('RESTRICT')

      table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('RESTRICT')

      table.integer('qty').notNullable().defaultTo(1)

      table.integer('price').notNullable().defaultTo(0)

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
