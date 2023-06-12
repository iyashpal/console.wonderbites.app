import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'carts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.string('session_id')
      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('RESTRICT')
      table.bigInteger('coupon_id').unsigned().nullable().references('coupons.id').onDelete('RESTRICT')
      table.jsonb('data').nullable()
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
