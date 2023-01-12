import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'roles'

  public async up() {
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
    })

    this.schema.table('users', (table) => {
      table.bigInteger('role_id').after('id').nullable().references('roles.id').onDelete("RESTRICT")
    })
  }

  public async down() {
    this.schema.table('users', (table) => {
      table.dropColumn('role_id')
    })
    this.schema.dropTable(this.tableName)
  }
}
