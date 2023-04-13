import { DateTime } from 'luxon'
import {User} from 'App/Models/index'
import Storage from 'App/Helpers/Storage'
import { AdvertisementStatus} from 'App/Models/Enums/Advertisement'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import {BaseModel, BelongsTo, belongsTo, column, computed, scope} from '@ioc:Adonis/Lucid/Orm'

export default class Banner extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @attachment({ folder: 'banners', preComputeUrl: true })
  public attachment: AttachmentContract

  @column()
  public options: {page: string, section: string, type: string, link: string | null | undefined}

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @computed()
  public get attachment_url () {
    if (this.attachment?.url) {
      return this.attachment.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }

  public static withActive = scope(query => query.where('status', AdvertisementStatus.ACTIVE))
}
