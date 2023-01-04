import { User } from '.'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public notifiable_type: string

  @column()
  public notifiable_id: number

  @column()
  public data: JSON

  @column.dateTime()
  public read_at: DateTime | null

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @belongsTo(() => User, {
    localKey: 'notifiableId',
    foreignKey: 'id',
    })
  public notifiable: BelongsTo<typeof User>

  public async markAsRead (this: Notification) {
    await this.merge({ read_at: DateTime.now() }).save()
  }

  public async markAsUnread (this: Notification) {
    await this.merge({ read_at: null }).save()
  }

  public get read () {
    return Boolean(this.read_at)
  }

  public get unread () {
    return !this.read_at
  }
}
