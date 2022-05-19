import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategoryOpeningPosition extends BaseSchema {
  protected tableName = 'category_opening_position'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('category_id').unsigned().notNullable()
        .references('categories.id').onDelete('CASCADE')

      table.bigInteger('opening_position_id').unsigned().notNullable()
        .references('opening_positions.id').onDelete('CASCADE')

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
