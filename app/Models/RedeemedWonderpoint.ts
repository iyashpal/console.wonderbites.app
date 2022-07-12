import { DateTime } from 'luxon'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Cart from './Cart'

export default class RedeemedWonderpoint extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public cartId: number | null

  @column()
  public points: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Relation to user who redeemed the points.
   */
  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  /**
   * Relation to user cart which utilized the wonderpoints.
   */
  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>
}
