import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Cart from '../Cart'
import Ingridient from '../Ingridient'

export default class CartIngridient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public cartId: number

  @belongsTo(() => Cart)
  public cart: BelongsTo<typeof Cart>

  @column()
  public ingridientId: number

  @belongsTo(() => Ingridient)
  public ingridient: BelongsTo<typeof Ingridient>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}