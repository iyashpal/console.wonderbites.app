import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')
      table.bigInteger('user_id').unsigned().nullable().references('users.id').onDelete('CASCADE')
      table.bigInteger('coupon_id').unsigned().nullable().references('coupons.id').onDelete('RESTRICT')
      table.string('ip_address').nullable()
      table.string('order_type').defaultTo('delivery')
      table.string('payment_mode').defaultTo('COD')
      table.string('first_name')
      table.string('last_name')
      table.string('street').nullable()
      table.string('city').nullable()
      table.string('phone').nullable()
      table.string('email').nullable()
      table.jsonb('location').nullable()
      table.string('reserved_seats').nullable()
      table.string('eat_or_pickup_time').nullable()
      table.text('note').nullable()
      table.jsonb('options').nullable()
      table.integer('status').defaultTo(0).comment('UPCOMING=0;PREPARING=1;DELIVERED=2;CANCELED=3;')
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
