import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'products'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('SET NULL')
      table.string('name').notNullable()
      table.text('description').nullable()
      table.string('sku').notNullable()
      table.string('calories').nullable()
      table.json('thumbnail').nullable()
      table.string('price').notNullable().defaultTo(0)
      table.string('status').defaultTo('published')
      table.timestamp('published_at', { useTz: true }).nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
