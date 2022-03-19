import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import CategoryBlog from '../CategoryBlog'
import Blog from '../Blog'

export default class BlogCategory extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public category_id: number

  @belongsTo(() => CategoryBlog)
  public categoryblog: BelongsTo<typeof CategoryBlog>

  @column()
  public blog_id: number

  @belongsTo(() => Blog)
  public blog: BelongsTo<typeof Blog>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
