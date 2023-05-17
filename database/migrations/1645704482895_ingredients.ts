import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Ingredients extends BaseSchema {
  protected tableName = 'ingredients'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.json('thumbnail').nullable()
      table.integer('price').unsigned().notNullable().defaultTo(0)
      table.string('unit')
      table.string('quantity')
      table.bigInteger('min_quantity').defaultTo(1)
      table.bigInteger('max_quantity').defaultTo(1)
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
