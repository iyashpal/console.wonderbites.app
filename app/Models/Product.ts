import { DateTime } from 'luxon'
import Storage from 'App/Helpers/Storage'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, column, computed, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import { BelongsTo, belongsTo, HasOne, hasOne, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { Cart, Category, ExtraField, Ingredient, Media, Order, Review, User, Wishlist } from 'App/Models'

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
  public price: number

  @attachment({folder: 'products', preComputeUrl: true})
  public thumbnail: AttachmentContract | null

  @column()
  public status: number

  @column.dateTime()
  public publishedAt: DateTime | null

  @column()
  public isCustomizable: boolean

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
  public get thumbnail_url () {
    if (this.thumbnail?.url) {
      return this.thumbnail.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Media, {
    pivotColumns: ['is_default', 'order'],
    pivotTimestamps: true,
  })
  public media: ManyToMany<typeof Media>

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @manyToMany(() => Ingredient, {
    pivotColumns: [
      'id', 'price', 'max_quantity', 'min_quantity', 'quantity', 'is_locked', 'is_required', 'is_optional',
    ],
    pivotTimestamps: true,
  })
  public ingredients: ManyToMany<typeof Ingredient>

  @manyToMany(() => Cart, {
    pivotColumns: ['id', 'cart_id', 'product_id', 'qty'],
    pivotTimestamps: true,
  })
  public carts: ManyToMany<typeof Cart>

  @manyToMany(() => Order, {
    pivotColumns: ['id', 'price', 'qty'],
    pivotTimestamps: true,
  })
  public orders: ManyToMany<typeof Order>

  @hasOne(() => Review, {foreignKey: 'reviewableId', onQuery: query => query.where('reviewable', 'Product')})
  public review: HasOne<typeof Review>

  @hasMany(() => Review, {foreignKey: 'reviewableId', onQuery: query => query.where('reviewable', 'Product')})
  public reviews: HasMany<typeof Review>

  @hasMany(() => ExtraField, {foreignKey: 'relationId', onQuery: query => query.where('relation', 'Product')})
  public extraFields: HasMany<typeof ExtraField>

  @manyToMany(() => Wishlist)
  public wishlists: ManyToMany<typeof Wishlist>
}
