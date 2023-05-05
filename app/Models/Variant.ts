import { DateTime } from 'luxon'
import {Attribute} from 'App/Models/index'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public price: string | number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Attribute)
  public attributes: HasMany<typeof Attribute>
}
