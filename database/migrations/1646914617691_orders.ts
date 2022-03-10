import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Orders extends BaseSchema {
  protected tableName = 'orders'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.bigInteger('user_id').unsigned().notNullable().references('users.id').onDelete('CASCADE')

      //table.bigInteger('product_id').unsigned().notNullable().references('products.id').onDelete('CASCADE')
      table.integer('total_amount').unsigned().notNullable().defaultTo(0)
      table.string('payment_method').notNullable()
      table.string('order_note').nullable()
      table.integer('status').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.timestamp('deleted_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
