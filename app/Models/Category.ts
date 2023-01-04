import { DateTime } from 'luxon'
import { Cuisine, Product, Ingredient } from '.'
import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany, scope } from '@ioc:Adonis/Lucid/Orm'

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
  public status: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @computed()
  public get isForProduct () {
    return this.type === 'Product'
  }

  @computed()
  public get isForCuisine () {
    return this.type === 'Cuisine'
  }

  @computed()
  public get isForBlog () {
    return this.type === 'Blog'
  }

  @computed()
  public get isForIngredient () {
    return this.type === 'Ingredient'
  }

  @belongsTo(() => Category, { foreignKey: 'parent' })
  public category: BelongsTo<typeof Category>

  @manyToMany(() => Product, { pivotTable: 'category_product' })
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Cuisine, { pivotTable: 'category_cuisine' })
  public cuisines: ManyToMany<typeof Cuisine>

  @manyToMany(() => Ingredient, { pivotTable: 'category_ingredient' })
  public ingredients: ManyToMany<typeof Ingredient>

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
