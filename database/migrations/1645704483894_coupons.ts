import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class extends BaseSchema {
  protected tableName = 'coupons'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.bigIncrements('id')

      table.string('title')

      table.text('description').nullable()

      table.string('code')

      table.string('discount_type')

      table.string('discount_value')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('started_at', { useTz: true }).nullable()

      table.timestamp('expired_at', { useTz: true }).nullable()

      table.timestamp('created_at', { useTz: true })

      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
