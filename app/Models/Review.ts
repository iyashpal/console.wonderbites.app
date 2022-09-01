import {DateTime} from 'luxon'
import {Order, Product, User} from 'App/Models'
import {BaseModel, BelongsTo, belongsTo, column} from '@ioc:Adonis/Lucid/Orm'

export default class Review extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  public userId: number

  @column()
  public reviewableId: number

  @column()
  public reviewableType: string

  @column()
  public rating: number

  @column()
  public title: string

  @column()
  public body: string

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @belongsTo(() => Product, {
    foreignKey: 'reviewable_id',
    onQuery: (query) => query.where('reviewable_type', 'Product'),
  })
  public product: BelongsTo<typeof Product>

  @belongsTo(() => Order, {
    foreignKey: 'reviewable_id',
    onQuery: (query) => query.where('reviewable_type', 'Product'),
  })
  public order: BelongsTo<typeof Order>
}
