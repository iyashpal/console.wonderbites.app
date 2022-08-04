import { DateTime } from 'luxon'
import { Cart, User, Order, Product, Wishlist, Category } from '.'
import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Ingredient extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public description: string

  @column()
  public price: string

  @column()
  public imagePath: string

  @column()
  public status: number

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Cart)
  public carts: ManyToMany<typeof Cart>

  @manyToMany(() => Order)
  public orders: ManyToMany<typeof Order>

  @manyToMany(() => Wishlist)
  public wishlists: ManyToMany<typeof Wishlist>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @computed()
  public image () {
    return '/images/placeholders/ingredient.png'
  }
}
