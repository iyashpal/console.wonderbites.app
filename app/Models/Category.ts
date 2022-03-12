import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Cuisine from './Cuisine'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public parent: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public imagePath: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Cuisine, { pivotTable: 'category_cuisine' })
  public cuisines: ManyToMany<typeof Cuisine>
}
