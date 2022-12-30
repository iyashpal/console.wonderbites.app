import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import Notifiable from 'App/Features/Notification/Notifiable'
import { BelongsTo, HasMany, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { Cart, Address, Product, Wishlist, Wonderpoint, Order, Review, Feedback } from '.'
import { beforeSave, belongsTo, column, computed, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'

export default class User extends Notifiable {
  @column({ isPrimary: true })
  public id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public mobile: string

  @attachment({ folder: 'avatars', preComputeUrl: true })
  public avatar: AttachmentContract | null

  @column({ serializeAs: null })
  public password: string

  @column()
  public address_id: Number

  @column()
  public remember_me_token?: string

  @column()
  public status: number

  @column()
  public language: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  /**
   * Hash user password before saving to database.
   *
   * @param user
   */
  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  /**
   * Relation to default address of user.
   */
  @belongsTo(() => Address)
  public address: BelongsTo<typeof Address>

  /**
   * Relation to user addresses.
   */
  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  /**
   * Relation to user products.
   */
  @hasMany(() => Product)
  public products: HasMany<typeof Product>

  /**
   * Relation to active cart of the user.
   */
  @hasOne(() => Cart, { onQuery: query => query.where('status', 1) })
  public cart: HasOne<typeof Cart>

  /**
   * Relation to user reviews.
   */
  @hasMany(() => Review)
  public reviews: HasMany<typeof Review>

  /**
   * Relation to wishlist of user.
   */
  @hasOne(() => Wishlist)
  public wishlist: HasOne<typeof Wishlist>

  /**
   * Relation to user orders.
   */
  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  /**
   * Relation to user wonderpoints.
   */
  @hasMany(() => Wonderpoint)
  public wonderpoints: HasMany<typeof Wonderpoint>

  /**
   * Relation to user feedbacks.
   */
  @hasMany(() => Feedback)
  public feedbacks: HasMany<typeof Feedback>

  /**
   * Default User avatar attribute.
   */
  @computed()
  public get default_avatar () {
    if (this.avatar?.url) {
      return this.avatar.url
    }

    let name = this.email ? this.email : [this.first_name, this.last_name].join(' ')

    return `https://unavatar.io/${name}?fallback=https://ui-avatars.com/api?name=${name}&color=7F9CF4&background=EBF4FF&format=svg`
  }
}
