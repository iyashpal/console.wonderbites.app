import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlogCategories extends BaseSchema {
  protected tableName = 'blog_categories'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('category_id').unsigned().notNullable().references('category_blogs.id').onDelete('CASCADE')

      table.bigInteger('blog_id').unsigned().notNullable().references('blogs.id').onDelete('CASCADE')

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
