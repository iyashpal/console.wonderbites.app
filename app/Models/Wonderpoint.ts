import {User} from '.'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Wonderpoint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public action: string

  @column()
  public event: string

  @column()
  public points: number

  @column()
  public extras: object

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  /**
   * Relation to user
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
