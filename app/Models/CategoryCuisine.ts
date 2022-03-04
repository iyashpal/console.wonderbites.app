import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Cuisine from './Cuisine'
import Category from './Category'

export default class CategoryCuisine extends BaseModel {

  @column()
  public id: number

  @column()
  public cuisine_id: number

  @column()
  public category_id: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Cuisine)
  public cuisine: BelongsTo<typeof Cuisine>


  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

}
