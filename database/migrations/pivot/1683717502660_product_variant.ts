import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'product_variant'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.bigInteger('product_id').unsigned().references('products.id').onDelete('CASCADE')
      table.bigInteger('variant_id').unsigned().references('variants.id').onDelete('CASCADE')
      table.integer('proteins').defaultTo(1)
      table.integer('vegetables').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
