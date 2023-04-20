import { DateTime } from 'luxon'
import { User } from 'App/Models/index'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class VerificationCode extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

  @column()
  public action: string

  @column()
  public source: string

  @column()
  public code: string

  @column()
  public token: string

  @column.dateTime()
  public expiresAt: DateTime

  @column.dateTime()
  public verifiedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
