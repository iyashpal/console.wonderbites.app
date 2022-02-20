import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CuisineCategory extends BaseSchema {
  protected tableName = 'cuisine_category'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.integer('cuisine_id').unsigned().references('cuisines.id')

      table.integer('category_id').unsigned().references('cateogries.id')

      table.unique(['cuisine_id', 'category_id'])

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
