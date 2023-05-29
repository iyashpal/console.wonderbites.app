import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'attribute_variant'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('attribute_id').unsigned().references('attributes.id').onDelete('CASCADE')
      table.bigInteger('variant_id').unsigned().references('variants.id').onDelete('CASCADE')
      table.string('price').nullable().defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
