import { DateTime } from 'luxon'
import { User, Product, Address, Ingredient, Coupon } from '.'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public addressId: number

  @column()
  public couponId: number

  @column()
  public ipAddress: string

  @column()
  public paymentMethod: string

  @column()
  public note: string

  @column()
  public status: number

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

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
