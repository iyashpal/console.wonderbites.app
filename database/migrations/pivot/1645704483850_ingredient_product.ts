import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'ingredient_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('ingredient_id').unsigned().references('ingredients.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().references('products.id').onDelete('CASCADE')

      table.bigInteger('price').defaultTo(1)

      table.bigInteger('quantity').defaultTo(1)

      table.bigInteger('min_quantity').defaultTo(1)

      table.bigInteger('max_quantity').defaultTo(1)

      table.boolean('is_locked').defaultTo(false)
        .comment('It cannot be modified.')

      table.boolean('is_required').defaultTo(false)
        .comment('Quantity can be increased or decreased but it cannot be removed.')

      table.boolean('is_optional').defaultTo(true).comment('It can be removed.')

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
