import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Notifications extends BaseSchema {
  protected tableName = 'notifications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table.string('type').notNullable()

      table.string('notifiable_type').notNullable()

      table.bigInteger('notifiable_id').unsigned().notNullable()

      table.jsonb('data').notNullable()

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('read_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true }).notNullable()

      table.timestamp('updated_at', { useTz: true }).notNullable()
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
