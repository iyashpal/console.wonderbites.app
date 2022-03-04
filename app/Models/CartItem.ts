import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cart from './Cart'
import Product from './Product'
export default class CartItem extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  
  @column()
  public cart_id: number

  @column()
  public product_id: number

  @column()
  public device_token: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
  
  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
