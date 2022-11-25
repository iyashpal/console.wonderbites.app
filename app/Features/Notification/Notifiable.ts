import { DateTime } from 'luxon'
import { Notification } from 'App/Models'
import { BaseModel, ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class Notifiable extends BaseModel {
  /**
   * Get all the notifications related to the modal.
   * 
   * @returns ModelQueryBuilderContract<typeof Notification, Notification>
   */
  public notifications (): ModelQueryBuilderContract<typeof Notification, Notification> {
    return Notification.query()
      .where('notifiable_id', this.$attributes.id)
      .where('notifiable_type', this.constructor.name)
  }

  public async notify () {
    console.log(this.constructor.name)
    //
  }

  /**
   * Get all read notifications.
   *
   * @returns 
   */
  public readNotifications (): ModelQueryBuilderContract<typeof Notification, Notification> {
    return this.notifications()
      .whereNotNull('readAt').orderBy('createdAt', 'desc')
  }

  /**
   * Get all un-read notifications.
   * 
   * @returns 
   */
  public unreadNotifications () {
    return this.notifications()
      .whereNull('readAt').orderBy('createdAt', 'desc')
  }

  /**
   * Mark un-read notifications as read.
   *
   * @returns 
   */
  public async markNotificationsAsRead (): Promise<any[]> {
    return await this.notifications()
      .whereNull('readAt').update({ readAt: DateTime.now().toSQL() })
  }
}
