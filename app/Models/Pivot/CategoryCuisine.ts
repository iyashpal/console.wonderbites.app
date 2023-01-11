import { DateTime } from 'luxon'
import { Category, Cuisine } from '..'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class CategoryCuisine extends BaseModel {
  @column()
  public id: number

  @column()
  public cuisineId: number

  @column()
  public categoryId: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Cuisine)
  public cuisine: BelongsTo<typeof Cuisine>

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>
}
