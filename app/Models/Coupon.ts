import { DateTime } from 'luxon'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Coupon extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public title: string

  @column()
  public description: string

  @column()
  public code: string

  @column()
  public discountType: string

  @column()
  public discountValue: string

  @column.dateTime({ autoCreate: true })
  public startedAt: DateTime

  @column.dateTime()
  public expiredAt: DateTime

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @computed()
  public get discount () {
    if (this.discountType === 'price') {
      return `$${this.discountValue}`
    }

    return `${this.discountValue}%`
  }
}
