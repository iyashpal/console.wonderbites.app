import { Cart } from '.'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'

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
  public discount_type: string

  @column()
  public discount_value: string

  @column.dateTime({ autoCreate: true })
  public started_at: DateTime

  @column.dateTime()
  public expired_at: DateTime

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @hasMany(() => Cart)
  public carts: HasMany<typeof Cart>

  @computed()
  public get discount () {
    if (this.discount_type === 'price') {
      return `${ this.discount_value }L`
    }

    return `${ this.discount_value }%`
  }

  @computed()
  public get is_expired () {
    return parseInt(this.expired_at.diff(DateTime.now(), 'days').toFormat('d')) < 0
  }

  @computed()
  public get is_valid () {
    return parseInt(this.expired_at.diff(DateTime.now(), 'days').toFormat('d')) >= 0
  }
}
