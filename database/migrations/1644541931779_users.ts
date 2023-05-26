import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'users'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id').primary()

      table.string('first_name').notNullable()

      table.string('last_name').notNullable()

      table.string('email', 255).notNullable()

      table.string('password', 180).notNullable()

      table.json('avatar').nullable()

      table.integer('address_id').unsigned().nullable()

      table.string('remember_me_token').nullable()

      table.string('mobile').notNullable()

      table.integer('status').defaultTo(1)

      table.string('language').defaultTo('EN')

      /**
       * Uses timestampz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', {useTz: true}).notNullable()
      table.timestamp('updated_at', {useTz: true}).notNullable()
      table.timestamp('deleted_at', {useTz: true}).defaultTo(null)
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
