import { Category } from '.'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Storage from 'App/Helpers/Storage'

export default class Cuisine extends BaseModel {
  @column({ isPrimary: true })
  public id: number

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

  @computed()
  public get default_thumbnail () {
    if (this.thumbnail) {
      return this.thumbnail.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }
}
