import Address from './Address'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { column, beforeSave, BaseModel, hasMany, HasMany } from '@ioc:Adonis/Lucid/Orm'

export default class User extends BaseModel {
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

  @column()
  public image_path: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public address_id: Number

  @column()
  public rememberMeToken?: string

  @column()
  public status: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @beforeSave()
  public static async hashPassword (user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  @hasMany(() => Address)
  public addresses: HasMany<typeof Address>

  public static url () {
    // eslint-disable-next-line max-len
    let name = this.$getColumn('email') ? this.$getColumn('email') : this.$getColumn('first_name') + ' ' + this.$getColumn('last_name')

    return `https://unavatar.io/${name}?fallback=https://ui-avatars.com/api?name=${name}&color=7F9CF4&background=EBF4FF&format=svg`
  }
}
