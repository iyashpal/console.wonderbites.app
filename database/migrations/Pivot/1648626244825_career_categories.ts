import BaseSchema from '@ioc:Adonis/Lucid/Schema'
export default class CareerCategories extends BaseSchema {
  protected tableName = 'career_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.bigInteger('brand_id').unsigned().notNullable().references('brands.id').onDelete('CASCADE')
      table.string('name').notNullable()
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
