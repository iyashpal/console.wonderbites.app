import { DateTime } from 'luxon'
import Storage from 'App/Helpers/Storage'
import { Cart, User, Order, Product, Wishlist, Category } from '.'
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
  public user_id: number

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

  @column()
  public minQuantity: number

  @column()
  public maxQuantity: number

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @column.dateTime()
  public deleted_at: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

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

  @computed()
  public image () {
    if (this.thumbnail?.url) {
      return this.thumbnail.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }
}
