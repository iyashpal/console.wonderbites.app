import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryBlogs extends BaseSchema {
  protected tableName = 'category_blogs'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
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
