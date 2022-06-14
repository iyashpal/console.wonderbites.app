import Cart from './Cart'
import User from './User'
import Media from './Media'
import Order from './Order'
import { DateTime } from 'luxon'
import Category from './Category'
import Wishlist from './Wishlist'
import Ingridient from './Ingridient'
import { BaseModel, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo, belongsTo, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Product extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public userId: number

  @column()
  public description: string

  @column()
  public sku: string

  @column()
  public calories: string

  @column()
  public price: string

  @column()
  public imagePath: string

  @column()
  public status: number

  @column.dateTime()
  public publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Media)
  public media: ManyToMany<typeof Media>

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @manyToMany(() => Ingridient)
  public ingridents: ManyToMany<typeof Ingridient>

  @manyToMany(() => Cart)
  public carts: ManyToMany<typeof Cart>

  @manyToMany(() => Order)
  public orders: ManyToMany<typeof Order>

  @manyToMany(() => Wishlist)
  public wishlists: ManyToMany<typeof Wishlist>

  /**
   * Get product default thumbnail based on imagePath column value.
   * 
   * @returns {String}
   */
  @computed()
  public get thumbnail () {
    return this.imagePath ? `/uploads/${this.imagePath}` : '/images/placeholders/product.png'
  }
}
