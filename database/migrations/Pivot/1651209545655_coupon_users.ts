import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CouponUser extends BaseSchema {
  protected tableName = 'coupon_user'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')

      table.bigInteger('coupon_id').unsigned().notNullable().references('coupon.id').onDelete('CASCADE')

      table.bigInteger('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

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
