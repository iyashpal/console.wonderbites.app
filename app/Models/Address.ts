import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import { User } from '.'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public firstName: string

  @column()
  public lastName: string

  @column()
  public street: string

  @column()
  public city: string

  @column()
  public phone: string

  @column()
  public email: string | null

  @column()
  public location: object

  @column()
  public type: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  /**
   * Serialize address fields for checkout.
   * 
   * @returns Object
   */
  @computed()
  public get serializedForCheckout () {
    return {
      first_name: this.firstName,
      last_name: this.lastName,
      street: this.street,
      city: this.city,
      phone: this.phone,
      ...(this.email ? { email: this.email } : {}),
      location: this.location,
    }
  }
}
