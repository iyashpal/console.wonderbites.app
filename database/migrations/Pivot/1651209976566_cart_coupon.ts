import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CartCoupons extends BaseSchema {
  protected tableName = 'cart_coupon'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.bigInteger('cart_id').unsigned().notNullable().references('carts.id').onDelete('CASCADE')

      table.bigInteger('coupon_id').unsigned().notNullable().references('coupons.id').onDelete('CASCADE')

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
