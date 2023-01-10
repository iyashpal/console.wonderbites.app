import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class PasswordReset extends BaseModel {
  public static primaryKey = 'email'

  @column()
  public email: string

  @column()
  public token: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime
}
