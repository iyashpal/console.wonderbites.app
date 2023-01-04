import { DateTime } from 'luxon'
import { User, Coupon, Product, Ingredient } from '.'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number | null | undefined

  @column()
  public ip_address: string

  @column()
  public coupon_id: number | null

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @manyToMany(() => Product, {
    pivotColumns: ['id', 'qty'],
    pivotTimestamps: true,
    })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient, {
    pivotColumns: ['id', 'qty', 'price', 'product_id'],
    pivotTimestamps: true,
    })
  public ingredients: ManyToMany<typeof Ingredient>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  public coupon: BelongsTo<typeof Coupon>
}
