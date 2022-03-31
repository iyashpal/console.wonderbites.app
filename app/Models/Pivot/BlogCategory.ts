import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from '../Category'
import Blog from '../Blog'

export default class BlogCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public categoryId: number

  @belongsTo(() => Category)
  public category: BelongsTo<typeof Category>

  @column()
  public blogId: number

  @belongsTo(() => Blog)
  public blog: BelongsTo<typeof Blog>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
