import { Product } from '.'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Storage from 'App/Helpers/Storage'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public user_id: number

  @column()
  public title: string

  @column()
  public caption: string

  @attachment({ folder: 'uploads', preComputeUrl: true })
  public attachment: AttachmentContract

  @column.dateTime({ autoCreate: true })
  public created_at: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updated_at: DateTime

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @computed()
  public get attachment_url () {
    if (this.attachment?.url) {
      return this.attachment.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }
}
