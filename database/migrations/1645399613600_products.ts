import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')

      table.string('name').notNullable()

      table.text('description').nullable()

      table.text('short_description').nullable()

      table.string('calories').nullable()

      table.text('image_path').nullable()

      table.string('price').notNullable().defaultTo(0)

      table.integer('status').defaultTo(1)

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('published_at', { useTz: true })
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
