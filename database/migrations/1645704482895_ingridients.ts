import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ingridients extends BaseSchema {
  protected tableName = 'ingridients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')

      table.string('name').notNullable()

      table.text('description').nullable()

      table.string('image_path').nullable()

      table.integer('price').unsigned().notNullable().defaultTo(0)

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