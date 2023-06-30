import {DateTime} from 'luxon'
import {User, Coupon, Review} from '.'
import {BelongsTo, BaseModel, scope} from '@ioc:Adonis/Lucid/Orm'
import {column, belongsTo, hasOne, HasOne} from '@ioc:Adonis/Lucid/Orm'

export default class Order extends BaseModel {
  @column({isPrimary: true})
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

  @column({consume: value => value, prepare: value => JSON.stringify(value)})
  public data: CartDataProduct[]

  @column()
  public reservedSeats: number

  @column()
  public eatOrPickupTime: string

  @column()
  public paymentMode: string

  @column({consume: value => value, prepare: value => JSON.stringify(value)})
  public location: {
    lat?: string,
    lng?: string,
  }

  @column()
  public note: string

  @column({consume: value => value, prepare: value => JSON.stringify(value) })
  public options: any

  @column()
  public status: number

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Coupon)
  public coupon: BelongsTo<typeof Coupon>

  @hasOne(() => Review, {
    foreignKey: 'reviewableId',
    onQuery: query => query.where('reviewable', 'Order'),
  })
  public review: HasOne<typeof Review>

  public static asGuest = scope((query, id: number, token: string) => {
    query.whereNull('user_id').where('token', token).where('id', id)
  })

  public ProductIDs () {
    return (this.data ?? []).map(({id}) => id)
  }

  public IngredientIDs () {
    return (this.data ?? []).flatMap(product => [
      ...(product.ingredients?.map(({id}) => id) ?? []),
      ...(product.variant?.ingredients?.map(({id}) => id) ?? []),
    ])
  }

  public VariantIDs () {
    return [
      ...((this.data ?? []).filter(({variant}) => variant?.id).map(({variant}) => variant?.id) ?? []),
    ] as number[]
  }

  public CategoryIDs () {
    return (this.data ?? []).flatMap(product => [
      ...(product?.ingredients?.map(({category}) => category) ?? []),
      ...(product?.variant?.ingredients?.map(({category}) => category) ?? []),
    ])
  }
}
