import {DateTime} from 'luxon'
import {User} from 'App/Models/index'
import {slugify} from '@ioc:Adonis/Addons/LucidSlugify'
import {BaseModel, column, HasMany, hasMany} from '@ioc:Adonis/Lucid/Orm'

export default class Role extends BaseModel {
  @column({isPrimary: true})
  public id: number

  @column()
  @slugify({strategy: 'dbIncrement', fields: ['title']})
  public slug: string

  @column()
  public title: string

  @column()
  public description: string | null

  @column()
  public scope: { [key: string]: string }

  @column.dateTime({autoCreate: true})
  public createdAt: DateTime

  @column.dateTime({autoCreate: true, autoUpdate: true})
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime

  @hasMany(() => User)
  public users: HasMany<typeof User>
}
