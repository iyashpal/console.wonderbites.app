import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Wonderpoints extends BaseSchema {
  protected tableName = 'wonderpoints'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

      table.string('action').defaultTo('earn')

      table.string('event').notNullable()

      table.integer('points').unsigned().notNullable()

      table.json('extras').nullable()

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
