import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class JobApplications extends BaseSchema {
  protected tableName = 'job_applications'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.bigInteger('opening_id').unsigned().nullable().references('opening_positions.id').onDelete('SET NULL')
      table.string('first_name').notNullable()
      table.string('last_name').notNullable()
      table.string('email').notNullable()
      table.string('mobile').notNullable()
      table.text('address').notNullable()
      table.string('desired_pay').notNullable()
      table.string('reference_from').notNullable()
      table.string('notice_period').notNullable()
      table.string('agreed_terms_conditions').notNullable()
      table.text('resume_path').nullable()
      table.integer('status').defaultTo(1)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
