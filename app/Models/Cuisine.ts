import {Category, User} from '.'
import { DateTime } from 'luxon'
import Storage from 'App/Helpers/Storage'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import {BaseModel, BelongsTo, belongsTo, column, computed, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'

export default class Cuisine extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @column()
  public description: string

  @attachment({ folder: 'cuisines', preComputeUrl: true })
  public thumbnail: AttachmentContract | null

  @column()
  public status: number

  @manyToMany(() => Category)
  public categories: ManyToMany<typeof Category>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime | null

  @computed()
  public get thumbnail_url () {
    if (this.thumbnail) {
      return this.thumbnail.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>
}
