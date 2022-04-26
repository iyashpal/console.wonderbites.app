import Cart from './Cart'
import Address from './Address'
import { DateTime } from 'luxon'
import Wishlist from './Wishlist'
import Hash from '@ioc:Adonis/Core/Hash'
import Notification from './Notification'
import { BaseModel, beforeSave, column, computed, hasMany, HasMany, HasOne, hasOne } from '@ioc:Adonis/Lucid/Orm'

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

  @hasOne(() => Address)
  public address: HasOne<typeof Address>

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

  @computed()
  public get avatar () {
    let name = this.email ? this.email : [this.firstName, this.lastName].join(' ')

    return `https://unavatar.io/${name}?fallback=https://ui-avatars.com/api?name=${name}&color=7F9CF4&background=EBF4FF&format=svg`
  }

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  @hasMany(() => Notification, {
    foreignKey: 'notifiableId',
    onQuery: query => query.where('notifiable_type', 'User'),
  })
  public notifications: HasMany<typeof Notification>

  @hasOne(() => Cart)
  public cart: HasOne<typeof Cart>

  @hasOne(() => Wishlist)
  public wishlist: HasOne<typeof Wishlist>
}
