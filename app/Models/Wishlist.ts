import { DateTime } from 'luxon'
import { User, Product, Ingredient } from '.'
import { BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
export default class Wishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public ipAddress: string

  @manyToMany(() => Product, {
    pivotColumns: ['qty'],
    pivotTimestamps: true,
    })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Ingredient)
  public ingredients: ManyToMany<typeof Ingredient>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
