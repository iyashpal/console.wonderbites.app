import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class IngredientProduct extends BaseSchema {
  protected tableName = 'ingredient_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('ingredient_id').unsigned().references('ingredients.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().references('products.id').onDelete('CASCADE')

      table.string('qty').defaultTo(1)

      table.string('max_quantity').defaultTo(0)

      table.boolean('is_required').defaultTo(true)

      table.boolean('is_optional').defaultTo(false)

      table.boolean('is_addon').defaultTo(false)

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
