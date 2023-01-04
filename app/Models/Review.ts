import { DateTime } from 'luxon'
import { Order, Product, User } from 'App/Models'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Review extends BaseModel {
  public static readonly DRAFT = 0

  public static readonly PUBLISHED = 1

  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public reviewable_id: number

  @column()
  public reviewable: string

  @column()
  public rating: number

  @column()
  public title: string

  @column()
  public body: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Product, { foreignKey: 'reviewableId' })
  public product: BelongsTo<typeof Product>

  @belongsTo(() => Order, { foreignKey: 'reviewableId' })
  public order: BelongsTo<typeof Order>
}
