import { BaseModel, belongsTo, BelongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Ingredient from '../Ingredient'
import Order from '../Order'

export default class IngridentOrder extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public ingridentId: number

  @belongsTo(() => Ingredient)
  public ingridient: BelongsTo<typeof Ingredient>

  @column()
  public orderId: number

  @belongsTo(() => Order)
  public order: BelongsTo<typeof Order>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
