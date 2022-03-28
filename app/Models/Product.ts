import {
  BaseModel, BelongsTo, belongsTo, column, computed, HasMany, hasMany, ManyToMany, manyToMany
} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Cart from './Cart'
import Category from './Category'
import Ingridient from './Ingridient'
import Media from './Media'
import Order from './Order'
import User from './User'
import Wishlist from './Wishlist'

export default class Product extends BaseModel {
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
  public sku: string

  @column()
  public calories: string

  @column()
  public price: string

  @column()
  public imagePath: string

  @column()
  public status: number

  @hasMany(() => Media, {
    localKey: 'id',
    foreignKey: 'refId',
    onQuery (query) {
      query.where('refType', 'Product')
    },
  })
  public media: HasMany<typeof Media>

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

  @column.dateTime()
  public publishedAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

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
