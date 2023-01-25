import { DateTime } from 'luxon'
import { User, Product, Ingredient, Coupon, Review } from '.'
import { BelongsTo, ManyToMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { column, belongsTo, manyToMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number | null

  @column()
  public couponId: number | null

  @column()
  public ipAddress: string

  @column()
  public options: object

  @column()
  public deliverTo: {
    first_name: string,
    last_name?: string,
    street: string,
    city: string,
    phone: string,
    email?: string,
    location?: {
      lat?: string,
      lng?: string,
    }
  }

  @column()
  public note: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  public coupon: BelongsTo<typeof Coupon>

  @manyToMany(() => Product, {
    pivotColumns: ['id', 'qty', 'price'],
    pivotTimestamps: true,
  })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient, {
    pivotColumns: ['id', 'qty', 'price', 'product_id'],
    pivotTimestamps: true,
  })
  public ingredients: ManyToMany<typeof Ingredient>

  @hasOne(() => Review, { foreignKey: 'reviewableId', onQuery: query => query.where('reviewable', 'Order')})
  public review: HasOne<typeof Review>
}
