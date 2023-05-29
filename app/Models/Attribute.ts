import { DateTime } from 'luxon'
import {BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'
import {User, Variant} from 'App/Models/index'

export default class Attribute extends BaseModel {
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

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

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Variant, {
    pivotColumns: ['id', 'attribute_id', 'variant_id', 'category_id'],
    pivotTimestamps: true,
  })
  public variants: ManyToMany<typeof Variant>
}
