import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Cuisine from './Cuisine'

export default class Cateogry extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public parent: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public image_path: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Cuisine, { pivotTable: 'category_cuisine' })
  public cuisines: ManyToMany<typeof Cuisine>
}
