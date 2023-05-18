import { DateTime } from 'luxon'
import {Attribute, User} from 'App/Models/index'
import { AttachmentContract, attachment } from '@ioc:Adonis/Addons/AttachmentLite'
import {BaseModel, BelongsTo, belongsTo, column, ManyToMany, manyToMany} from '@ioc:Adonis/Lucid/Orm'

export default class Variant extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public name: string

  @attachment({folder: 'variants', preComputeUrl: true})
  public thumbnail: AttachmentContract | null

  @column()
  public description: string

  @column()
  public price: string | number

  @column()
  public status: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => User)
  public user: BelongsTo<typeof User>

  @manyToMany(() => Attribute)
  public attributes: ManyToMany<typeof Attribute>
}
