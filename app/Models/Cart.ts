import { DateTime } from 'luxon'
import { User, Coupon, Product, Ingredient } from '.'
import { BaseModel, BelongsTo, belongsTo, column, hasOne, HasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

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
  public couponId: number | null

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
    pivotColumns: ['id', 'qty', 'product_id'],
    pivotTimestamps: true,
    })
  public ingredients: ManyToMany<typeof Ingredient>

  @hasOne(() => Coupon)
  public coupon: HasOne<typeof Coupon>
}
