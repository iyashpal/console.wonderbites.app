import { DateTime } from 'luxon'
import { BaseModel, column ,BelongsTo, belongsTo} from '@ioc:Adonis/Lucid/Orm'
import Product from './Product'
import Wishlist from './Wishlist'
//import Category from './Category'
export default class ProductWishlist extends BaseModel {
  @column({ isPrimary: true })
  public id: number
  @column()
  public product_id: number
  @column()
  public wishlist_id : number
  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Wishlist)
  public wishlist: BelongsTo<typeof Wishlist>
  @belongsTo(() => Product)
  public product: BelongsTo<typeof Product>
}

