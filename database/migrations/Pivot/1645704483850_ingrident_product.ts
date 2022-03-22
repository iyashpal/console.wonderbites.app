import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class IngridentProduct extends BaseSchema {
  protected tableName = 'ingrident_product'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('ingridient_id').unsigned().references('ingridients.id').onDelete('CASCADE')

      table.bigInteger('product_id').unsigned().references('products.id').onDelete('CASCADE')

      table.boolean('is_removable').defaultTo(true)

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
