import {BaseModel, HasMany, hasMany, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Category from './Category'
import Media from './Media'
export default class OpeningPosition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public category_id: number

  @hasMany(() => Media, {
    localKey: 'id',
    foreignKey: 'refId',
    onQuery (query) {
      query.where('refType', 'Job')
    },
  })
  public media: HasMany<typeof Media>
  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @column()
  public description: string

  @column()
  public number: number

  @column()
  public start_date: string

  @column()
  public end_date: string

  @column()
  public status: number

  // @hasMany(() => Media, {
  //   localKey: 'id',
  //   foreignKey: 'objectId',
  //   onQuery (query) {
  //     query.where('objectType', 'Product')
  //   },
  // })
  // public media: HasMany<typeof Media>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
