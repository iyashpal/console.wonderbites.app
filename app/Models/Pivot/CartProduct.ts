import { DateTime } from 'luxon'
import { Cart, Product } from '..'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class CartProduct extends BaseModel {
  public static table = 'cart_product'

  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
