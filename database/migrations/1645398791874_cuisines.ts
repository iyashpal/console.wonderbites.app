import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Cuisines extends BaseSchema {
  protected tableName = 'cuisines'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('user_id').unsigned().references('users.id').onDelete('RESTRICT')

      table.string('name').notNullable()

      table.text('description').nullable()

      table.json('thumbnail').nullable()

      table.integer('status').defaultTo(1)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
