import { DateTime } from 'luxon'
import { Product, Ingredient } from '..'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class IngredientProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingredientId: number

  @column()
  public productId: number

  @column()
  public price: number

  @column()
  public quantity: number

  @column()
  public maxQuantity: number

  @column()
  public isLocked: boolean

  @column()
  public isRequired: boolean

  @column()
  public isOptional: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Ingredient)
  public ingredient: BelongsTo<typeof Ingredient>

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}
