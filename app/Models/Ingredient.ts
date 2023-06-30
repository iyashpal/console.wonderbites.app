import { DateTime } from 'luxon'
import Storage from 'App/Helpers/Storage'
import { User, Product, Category, Variant } from './index'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Ingredient extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public description: string

  @attachment({folder: 'ingredients', preComputeUrl: true})
  public thumbnail: AttachmentContract| null

  @column()
  public price: string

  @column()
  public unit: string

  @column()
  public quantity: number

  @column({ serializeAs: 'minQuantity' })
  public minQuantity: number

  @column({ serializeAs: 'maxQuantity' })
  public maxQuantity: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @manyToMany(() => Variant, {
    pivotColumns: ['category_id', 'variant_id', 'ingredient_id', 'price'],
    pivotTimestamps: true,
  })
  public variants: ManyToMany<typeof Variant>

  @computed({serializeAs: 'thumbnailUrl'})
  public get image () {
    if (this.thumbnail?.url) {
      return this.thumbnail.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }
}
