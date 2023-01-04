import { Product } from '.'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class ExtraField extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public relation: string

  @column()
  public relation_id: number

  @column()
  public field: string

  @column()
  public data: string

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => Product, {
    localKey: 'relationId'
    })
  public product: BelongsTo<typeof Product>
}
