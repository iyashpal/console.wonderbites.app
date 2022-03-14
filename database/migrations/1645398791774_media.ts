import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Media extends BaseSchema {
  protected tableName = 'media'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')

      table.bigInteger('object_id').unsigned().nullable()

      table.string('object_type').nullable()

      table.string('title').nullable()

      table.text('caption').nullable()

      table.string('file_path').notNullable()

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
