import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Ingredient from '../Ingredient'
import Product from '../Product'

export default class IngridentProduct extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingridientId: number

  @belongsTo(() => Ingredient)
  public ingridient: BelongsTo<typeof Ingredient>

  @column()
  public productId: number

  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
