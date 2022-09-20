import { DateTime } from 'luxon'
import { User, Product, Address, Ingredient, Coupon, Review } from '.'
import { column, belongsTo, hasMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo, HasMany, ManyToMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  public static readonly UPCOMING: number = 0

  public static readonly PREPARING: number = 1

  public static readonly DELIVERED: number = 2

  public static readonly CANCELED: number = 3

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

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient)
  public ingredients: ManyToMany<typeof Ingredient>

  @hasMany(() => Review, {
    foreignKey: 'typeId',
    onQuery: query => query.where('type', 'Order'),
    })
  public reviews: HasMany<typeof Review>
}
