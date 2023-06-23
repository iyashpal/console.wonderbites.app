import { DateTime } from 'luxon'
import { User, Coupon, Product, Ingredient } from './index'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Cart extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public token: string

  @column()
  public userId: number | null

  @column()
  public couponId: number | null

  @column()
  public status: number

  @column({
    prepare: (value)=> JSON.stringify(value),
    consume:(value)=> JSON.parse(value),
  })
  public data: CartDataProduct[]

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

  public static asGuest = scope((query, id: number, token: string) => {
    query.whereNull('user_id').where('token', token).where('id', id)
  })

  public ProductIDs () {
    return this.data.map(({id}) => id)
  }

  public IngredientIDs () {
    return this.data.flatMap(product => [
      ...(product.ingredients?.map(({ id }) => id) ?? []),
      ...(product.variant?.ingredients?.map(({id}) => id) ?? []),
    ])
  }

  public VariantIDs () {
    return [
      ...(this.data.filter(({variant}) => variant?.id).map(({variant}) => variant?.id) ?? []),
    ] as number[]
  }

  public CategoryIDs () {
    return this.data.flatMap(product => [
      ...(product.ingredients?.map(({ category }) => category) ?? []),
      ...(product.variant?.ingredients?.map(({category}) => category) ?? []),
    ])
  }
}
