import { DateTime } from 'luxon'
import Storage from 'App/Helpers/Storage'
import { Cuisine, Product, Ingredient, Variant } from './index'
import { BaseModel, BelongsTo, ManyToMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { belongsTo, column, computed, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Category extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public parent: number | null

  @column()
  public name: string

  @column()
  public description: string

  @attachment({ folder: 'categories', preComputeUrl: true })
  public thumbnail: AttachmentContract | null

  @column()
  public options: any

  @column()
  public status: string

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

  @belongsTo(() => Category, { foreignKey: 'parent' })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => Product, { pivotTable: 'category_product' })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Cuisine, { pivotTable: 'category_cuisine' })
  public cuisines: ManyToMany<typeof Cuisine>

  @manyToMany(() => Ingredient, { pivotTable: 'category_ingredient' })
  public ingredients: ManyToMany<typeof Ingredient>

  @manyToMany(() => Variant, {
    pivotColumns: ['variant_id', 'category_id', 'order', 'total_items'],
    pivotTimestamps: true,
  })
  public variants: ManyToMany<typeof Variant>

  public static root = scope((query) => query.whereNull('parent').whereNull('deleted_at'))

  /**
   * Query scope for different types of categories.
   */
  public static for = scope((query, type) => query.where('type', type))

  /**
   * Query scope for blog categories.
   */
  public static forBlog = scope((query) => query.where('type', 'Blog'))

  /**
   * Query scope for Job categories.
   */
  public static forJob = scope((query) => query.where('type', 'job'))

  /**
   * Query scope for product categories.
   */
  public static forProduct = scope((query) => query.where('type', 'Product'))

  /**
   * Query scope for ingredient categories.
   */
  public static forIngredient = scope((query) => query.where('type', 'Ingredient'))

  /**
   * Query scope for cuisine categories.
   */
  public static forCuisine = scope((query) => query.where('type', 'Cuisine'))
}
