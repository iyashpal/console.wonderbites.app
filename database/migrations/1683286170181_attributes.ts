import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'attributes'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').unsigned().references('users.id').onDelete('RESTRICT')
      table.string('name')
      table.text('description').nullable()
      table.string('price').defaultTo(0)
      table.boolean('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
