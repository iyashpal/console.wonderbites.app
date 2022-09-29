import { DateTime } from 'luxon'
import Product from '../Product'
import Wishlist from '../Wishlist'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class ProductWishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @column()
  public wishlistId: number

  @column()
  public qty: number

  @column()
  public price: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Wishlist)
  public wishlist: BelongsTo<typeof Wishlist>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
