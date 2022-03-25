import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import CareerCategory from './Pivot/CareerCategory'
export default class OpeningPosition extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public category_id: number

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

  @manyToMany(() => CareerCategory)
  public careercategory: ManyToMany<typeof CareerCategory>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
