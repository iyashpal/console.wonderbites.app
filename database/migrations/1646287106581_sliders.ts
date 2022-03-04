import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Sliders extends BaseSchema {
  protected tableName = 'sliders'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.string('title').notNullable()

      table.text('description').nullable()

      table.text('image_path').nullable()

      table.string('cta').notNullable()

      table.string('cta_link').notNullable()

      table.integer('type').defaultTo(1)

      table.integer('status').defaultTo(1)
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
