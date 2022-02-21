import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Products extends BaseSchema {
  protected tableName = 'products'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      
      table.increments('id')

      table.string('name').notNullable()

      table.integer('category_id').unsigned()
        .references('cateogries.id').onDelete('CASCADE')
      

      table.text('short_description').nullable()

      table.text('description').nullable()

      table.string('calories').nullable()

      table.string('price').notNullable()

      table.text('image_path').nullable()

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
