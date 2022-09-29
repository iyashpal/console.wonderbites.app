import { DateTime } from 'luxon'
import { Cart, Ingredient, Product } from '..'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class CartIngredient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @column()
  public ingredientId: number

  @column()
  public productId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @belongsTo(() => Ingredient)
  public ingredient: BelongsTo<typeof Ingredient>

  @belongsTo(() => Product, {
    localKey: 'id',
    foreignKey: 'productId',
    })
  public product: BelongsTo<typeof Product>
}
