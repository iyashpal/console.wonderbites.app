import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { BaseModel, BelongsTo, HasMany, HasOne } from '@ioc:Adonis/Lucid/Orm'
import { Cart, Address, Product, Wishlist, Wonderpoint, Notification, Order, Review } from '.'
import { beforeSave, belongsTo, column, computed, hasMany, hasOne } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public email: string

  @column()
  public mobile: string

  @column()
  public imagePath: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public addressId: Number

  @column()
  public rememberMeToken?: string

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
   * Relation to user notifications.
   */
  @hasMany(() => Notification, {
    foreignKey: 'notifiableId',
    onQuery: query => query.where('notifiable_type', 'User'),
    })
  public notifications: HasMany<typeof Notification>

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

  @hasMany(() => Order)
  public orders: HasMany<typeof Order>

  /**
   * Relation to user wonderpoints.
   */
  @hasMany(() => Wonderpoint)
  public wonderpoints: HasMany<typeof Wonderpoint>

  /**
   * User avatar attribute.
   */
  @computed()
  public get avatar () {
    let name = this.email ? this.email : [this.firstName, this.lastName].join(' ')

    return `https://unavatar.io/${ name }?fallback=https://ui-avatars.com/api?name=${ name }&color=7F9CF4&background=EBF4FF&format=svg`
  }
}
