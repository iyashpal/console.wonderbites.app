import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import CategoryBlog from './CategoryBlog'
import User from './User'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public user_id: number

  @column()
  public category_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public description: string

  @column()
  public short_description: string

  @column()
  public image_path: string

  @column()
  public status: number

  @manyToMany(() => CategoryBlog)
  public categories: ManyToMany<typeof CategoryBlog>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
