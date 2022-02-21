import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CuisineCategory extends BaseSchema {
  
  protected tableName = 'cuisine_category'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {

      table.integer('cuisine_id').unsigned().index("cuisine_id")

      table.integer('category_id').unsigned().index("category_id")

      table.foreign('cuisine_id').references('cuisines.id').onDelete('CASCADE')

      table.foreign('category_id').references('cateogries.id').onDelete('CASCADE')

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
