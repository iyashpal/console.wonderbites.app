import { DateTime } from 'luxon'
import { BelongsTo, belongsTo, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { Cart, Category, Ingredient, Media, Order, Review, User, Wishlist } from 'App/Models'

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

  @manyToMany(() => Ingredient, {
    pivotColumns: ['id', 'ingredient_id', 'product_id', 'is_required', 'is_optional', 'is_addon'],
    pivotTimestamps: true,
    })
  public ingredients: ManyToMany<typeof Ingredient>

  @manyToMany(() => Cart)
  public carts: ManyToMany<typeof Cart>

  @manyToMany(() => Order, {
    pivotColumns: ['id', 'price', 'qty'],
    pivotTimestamps: true,
    })
  public orders: ManyToMany<typeof Order>

  @hasMany(() => Review, {
    localKey: 'id',
    foreignKey: 'typeId',
    onQuery: query => query.where('type', 'Product'),
    })
  public reviews: HasMany<typeof Review>

  @manyToMany(() => Wishlist)
  public wishlists: ManyToMany<typeof Wishlist>

  /**
   * Get product default thumbnail based on imagePath column value.
   *
   * @returns {String}
   */
  @computed()
  public get thumbnail () {
    return this.imagePath ? `/uploads/${ this.imagePath }` : '/images/placeholders/product.png'
  }
}
