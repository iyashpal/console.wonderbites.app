import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('slug')
      table.string('title')
      table.text('description').nullable()
      table.jsonb('scope').nullable()
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', {useTz: true})
      table.timestamp('updated_at', {useTz: true})
      table.timestamp('deleted_at', {useTz: true})
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
