import {BaseModel, HasMany, hasMany, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from './Category'
import Media from './Media'

export default class Blog extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string

  @column()
  public slug: string

  @column()
  public user_id: number

  @hasMany(() => Media, {
    localKey: 'id',
    foreignKey: 'refId',
    onQuery (query) {
      query.where('refType', 'Product')
    },
  })
  public media: HasMany<typeof Media>
  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>
  @column()
  public description: string

  @column()
  public short_description: string

  @column()
  public image_path: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
