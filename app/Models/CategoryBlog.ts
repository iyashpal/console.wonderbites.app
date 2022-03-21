import { BaseModel, column} from '@ioc:Adonis/Lucid/Orm'
import { DateTime } from 'luxon'
export default class CategoryBlog extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public name: string
  @column()
  public status: number
  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
