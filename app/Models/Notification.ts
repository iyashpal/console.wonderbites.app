import { User } from '.'
import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'

export default class Notification extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public type: string

  @column()
  public notifiableType: string

  @column()
  public notifiableId: number

  @column()
  public data: JSON

  @column.dateTime()
  public readAt: DateTime | null

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User, {
    localKey: 'notifiableId',
    foreignKey: 'id',
    })
  public notifiable: BelongsTo<typeof User>

  public async markAsRead (this: Notification) {
    await this.merge({ readAt: DateTime.now() }).save()
  }

  public async markAsUnread (this: Notification) {
    await this.merge({ readAt: null }).save()
  }

  public get read () {
    return Boolean(this.readAt)
  }

  public get unread () {
    return !this.readAt
  }
}
