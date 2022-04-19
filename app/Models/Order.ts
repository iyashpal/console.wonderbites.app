import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Ingridient from './Ingridient'
import Product from './Product'
import User from './User'

export default class Order extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public ipAddress: string

  @column()
  public paymentMethod: string

  @column()
  public note: string

  @column()
  public status: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingridient)
  public ingridients: ManyToMany<typeof Ingridient>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
