import { Product } from '.'
import { DateTime } from 'luxon'
import { BaseModel, column, computed, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'

export default class Media extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public userId: number

  @column()
  public title: string

  @column()
  public caption: string

  @column()
  public filePath: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @manyToMany(() => Product)
  public products: ManyToMany<typeof Product>

  @computed()
  public get file_url () {
    return `/uploads/${this.filePath}`
  }
}
