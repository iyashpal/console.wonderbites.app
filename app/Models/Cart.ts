import { DateTime } from 'luxon'
import { User, Coupon, Product, Ingredient } from '.'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public userId: number | null | undefined

  @column()
  public couponId: number | null

  @column()
  public status: number

  @column()
  public data: {
    id: number;
    quantity: number;
    variant?: {
      id: number;
      attributes?: {
        id: number;
        category: number;
        quantity: number;
      }[]
    };
    ingredients?: {
      id: number;
      quantity: number;
      category: number;
    }[];
  }[]

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
    pivotColumns: ['id', 'qty', 'price', 'product_id'],
    pivotTimestamps: true,
  })
  public ingredients: ManyToMany<typeof Ingredient>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  public coupon: BelongsTo<typeof Coupon>
}
