import { DateTime } from 'luxon'
import { User, Product, Address, Ingredient, Coupon, Review } from '.'
import { BelongsTo, ManyToMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { column, belongsTo, manyToMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public addressId: number

  @column()
  public couponId: number | null

  @column()
  public ipAddress: string

  @column()
  public paymentMethod: string

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

  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  public coupon: BelongsTo<typeof Coupon>

  @manyToMany(() => Product, {
    pivotColumns: ['id', 'qty', 'price'],
    pivotTimestamps: true,
    })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient)
  public ingredients: ManyToMany<typeof Ingredient>

  @hasOne(() => Review, {
    foreignKey: 'typeId',
    onQuery: query => query.where('type', 'Order'),
    })
  public review: HasOne<typeof Review>
}
