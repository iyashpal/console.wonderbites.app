import User from './User'
import Coupon from './Coupon'
import Product from './Product'
import { DateTime } from 'luxon'
import Ingridient from './Ingridient'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null | undefined

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public ipAddress: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingridient)
  public ingridients: ManyToMany<typeof Ingridient>

  @manyToMany(() => Coupon)
  public coupons: ManyToMany<typeof Coupon>
}
