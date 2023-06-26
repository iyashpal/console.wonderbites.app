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
  public token: string | null

  @column()
  public orderType: string

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public street: string

  @column()
  public city: string

  @column()
  public phone: string

  @column()
  public email: string

  @column()
  public reservedSeats: number

  @column()
  public eatOrPickupTime: string

  @column({
    consume: (value) => value,
    prepare: (value) => JSON.stringify(value),
  })
  public location: {
    lat?: string,
    lng?: string,
  }

  @column()
  public note: string

  @column({
    consume: (value) => JSON.parse(value),
    prepare: (value) => JSON.stringify(value),
  })
  public options: any

  @column()
  public status: number

  @column()
  public paymentMode: string

  @column()
  public data: any

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

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
