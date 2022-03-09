import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Review extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public user_id: number
  @column()
  public product_id: number
  @column()
  public rating: number
  @column()
  public title: string
  @column()
  public body: string
  @column()
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public deletedAt: DateTime
}
