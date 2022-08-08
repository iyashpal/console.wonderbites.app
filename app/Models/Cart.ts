import User from './User'
import Coupon from './Coupon'
import Product from './Product'
import { DateTime } from 'luxon'
import Ingredient from './Ingredient'
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

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotColumns: ['id', 'qty'],
    pivotTimestamps: true,
  })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient, {
    pivotColumns: ['id', 'qty', 'cart_product_id'],
    pivotTimestamps: true,
  })
  public ingredients: ManyToMany<typeof Ingredient>

  @manyToMany(() => Coupon, {
    pivotColumns: ['id'],
    pivotTimestamps: true,
  })
  public coupons: ManyToMany<typeof Coupon>
}
