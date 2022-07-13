import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import User from './User'

export default class Wonderpoint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public action: string

  @column()
  public event: string

  @column()
  public description: string

  @column()
  public points: number

  @column()
  public extras: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relation to user
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
