import { Product } from '.'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { attachment, AttachmentContract } from '@ioc:Adonis/Addons/AttachmentLite'
import Storage from 'App/Helpers/Storage'

export default class Media extends BaseModel {
  /**
   * Serialize the `$extras` object as it is
   */
  public serializeExtras = true

  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public caption: string

  @attachment({ folder: 'uploads', preComputeUrl: true })
  public attachment: AttachmentContract

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product, {
    pivotColumns:['is_default', 'order'],
  })
  public products: ManyToMany<typeof Product>

  @computed()
  public get attachment_url () {
    if (this.attachment?.url) {
      return this.attachment.url
    }

    return Storage.public('/images/placeholder/square.svg')
  }
}
