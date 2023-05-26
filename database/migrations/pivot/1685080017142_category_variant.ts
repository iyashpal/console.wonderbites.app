import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'category_variant'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('category_id').references('categories.id').onDelete('CASCADE')
      table.bigInteger('variant_id').references('variants.id').onDelete('CASCADE')
      table.integer('order').nullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
