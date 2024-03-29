import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_cuisine'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('cuisine_id').unsigned().index('cuisine_id').references('cuisines.id').onDelete('CASCADE')

      table.bigInteger('category_id').unsigned().index('category_id').references('categories.id').onDelete('CASCADE')

      table.unique(['cuisine_id', 'category_id'])

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
