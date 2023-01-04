import { User } from '.'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'

export default class Address extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @column()
  public first_name: string

  @column()
  public last_name: string

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
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  /**
   * Serialize address fields for checkout.
   * 
   * @returns Object
   */
  @computed()
  public get serializedForCheckout () {
    return {
      first_name: this.first_name,
      last_name: this.last_name,
      street: this.street,
      city: this.city,
      phone: this.phone,
      ...(this.email ? { email: this.email } : {}),
      location: this.location,
    }
  }
}
