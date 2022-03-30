import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import Cuisine from './Cuisine'
import Product from './Product'

export default class Category extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public parent: number

  @column()
  public name: string

  @column()
  public description: string

  @column()
  public imagePath: string

  @column()
  public status: number

  @belongsTo(() => Category, { foreignKey: 'parent' })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Cuisine, { pivotTable: 'category_cuisine' })
  public cuisines: ManyToMany<typeof Cuisine>

  @computed()
  public get isForProduct() {
    return this.type === 'Product'
  }

  @computed()
  public get isForCuisine() {
    return this.type === 'Cuisine'
  }

  @computed()
  public get isForBlog() {
    return this.type === 'Blog'
  }

  @computed()
  public get isForIngridient() {
    return this.type === 'Ingridient'
  }

  /**
   * Query scope for different types of categories.
   */
  public static for = scope((query, type) => query.where('type', type))

  /**
   * Query scope for blog categories.
   */
  public static forBlog = scope((query) => query.where('type', 'Blog'))

  /**
   * Query scope for product categories.
   */
  public static forProduct = scope((query) => query.where('type', 'Product'))

  /**
   * Query scope for ingridient categories.
   */
  public static forIngridient = scope((query) => query.where('type', 'Ingridient'))

  /**
   * Query scope for cuisine categories.
   */
  public static forCuisine = scope((query) => query.where('type', 'Cuisine'))
}
