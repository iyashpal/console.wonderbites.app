import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Ingredient from '../Ingredient'
import Wishlist from '../Wishlist'

export default class IngridientWishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingridientId: number

  @belongsTo(() => Ingredient)
  public ingridient: BelongsTo<typeof Ingredient>

  @column()
  public wishlistId: number

  @belongsTo(() => Wishlist)
  public wishlist: BelongsTo<typeof Wishlist>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
