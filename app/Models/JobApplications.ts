import { BaseModel,column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
import OpeningPositions from './OpeningPosition'

export default class JobApplications extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string

  @column()
  public opening_id: number

  @column()
  public first_name: string

  @column()
  public last_name: string

  @column()
  public email: string

  @column()
  public mobile: string

  @column()
  public address: string

  @column()
  public desired_pay: string

  @column()
  public reference_from: string

  @column()
  public notice_period: string

  @column()
  public agreed_terms_conditions: string

  @column()
  public resume_path: string

  @column()
  public status: number

  @manyToMany(() => OpeningPositions)
  public openingpositions: ManyToMany<typeof OpeningPositions>

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @column.dateTime()
  public deletedAt: DateTime
}
