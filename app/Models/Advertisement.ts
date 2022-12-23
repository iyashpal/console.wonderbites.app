import { User } from '.'
import { DateTime } from 'luxon'
import { AdvertisementOptions, AdvertisementStatus } from './Enums/Advertisement'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import { BaseModel, BelongsTo, belongsTo, column, scope } from '@ioc:Adonis/Lucid/Orm'

export default class Advertisement extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public description: string

  @attachment({ folder: 'advertisements', preComputeUrl: true })
  public attachment: AttachmentContract

  @column()
  public options: AdvertisementOptions

  @column()
  public status: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  public static withActive = scope(query => query.where('status', AdvertisementStatus.ACTIVE))
}
