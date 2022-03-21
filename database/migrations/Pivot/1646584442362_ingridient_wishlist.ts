import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class IngridientWishlist extends BaseSchema {
  protected tableName = 'ingridient_wishlist'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('ingridient_id').unsigned().notNullable().references('ingridients.id').onDelete('CASCADE')

      table.bigInteger('wishlist_id').unsigned().notNullable().references('wishlists.id').onDelete('CASCADE')

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