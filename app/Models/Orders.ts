import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Orders extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public total_amount: number
  @column()
  public payment_method: string
  @column()
  public order_note: string
  @column()
  public status: number
  @column()
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public deletedAt: DateTime
}
