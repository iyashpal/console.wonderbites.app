import { DateTime } from 'luxon'
import { Product, Ingredient } from '..'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class IngredientProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingredientId: number

  @belongsTo(() => Ingredient)
  public ingredient: BelongsTo<typeof Ingredient>

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
