import { DateTime } from 'luxon'
import { Wishlist, Ingredient } from '..'
import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class IngridientWishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingridientId: number

  @column()
  public wishlistId: number

  @column()
  public price: number

  @column()
  public qty: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Wishlist)
  public wishlist: BelongsTo<typeof Wishlist>

  @belongsTo(() => Ingredient)
  public ingridient: BelongsTo<typeof Ingredient>
}
