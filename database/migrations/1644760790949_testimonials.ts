import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Testimonials extends BaseSchema {
  protected tableName = 'testimonials'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')

      table.string('name')

      table.string('title')

      table.text('body').nullable()

      table.string('image_path').nullable()

      table.integer('status').defaultTo(1)

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
