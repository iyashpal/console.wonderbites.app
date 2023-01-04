import { DateTime } from 'luxon'
import { User, Product, Ingredient, Coupon, Review } from '.'
import { BelongsTo, ManyToMany, BaseModel } from '@ioc:Adonis/Lucid/Orm'
import { column, belongsTo, manyToMany, hasOne, HasOne } from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number | null

  @column()
  public coupon_id: number | null

  @column()
  public ip_address: string

  @column()
  public options: object

  @column()
  public deliver_to: {
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
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

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
    pivotTimestamps: true
    })
  public ingredients: ManyToMany<typeof Ingredient>

  @hasOne(() => Review, { foreignKey: 'reviewableId', onQuery: query => query.where('reviewable', 'Order')})
  public review: HasOne<typeof Review>
}
