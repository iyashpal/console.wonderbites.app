import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OpeningPositions extends BaseSchema {
  protected tableName = 'opening_positions'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.bigInteger('category_id').unsigned().nullable().references('career_categories.id').onDelete('SET NULL')
      table.string('name').notNullable()
      table.integer('number').unsigned().notNullable()
      table.text('description').nullable()
      table.string('start_date').notNullable
      table.string('end_date').notNullable
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }
  public async down () {
    this.schema.dropTable(this.tableName)
  }
}