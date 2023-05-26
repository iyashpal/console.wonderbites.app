import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'reviews'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

      table.string('reviewable')

      table.bigInteger('reviewable_id').unsigned().notNullable()

      table.integer('rating').unsigned().notNullable().defaultTo(0)

      table.string('title').notNullable()

      table.text('body').notNullable()

      table.integer('status').defaultTo(0)

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
