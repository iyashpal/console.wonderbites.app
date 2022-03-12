import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Product from '../Product'
import Wishlist from '../Wishlist'

export default class ProductWishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column()
  public wishlistId: number

  @belongsTo(() => Wishlist)
  public wishlist: BelongsTo<typeof Wishlist>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
