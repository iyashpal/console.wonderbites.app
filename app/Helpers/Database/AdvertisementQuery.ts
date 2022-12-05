import Query from './Query'
import { Advertisement } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class AdvertisementQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Advertisement, Advertisement>

  constructor (protected $request: RequestContract) {
    super($request)

    this.$query = Advertisement.query()
  }

  /**
   * Get the query instance.
   * 
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  public query (): ModelQueryBuilderContract<typeof Advertisement, Advertisement> {
    return this.$query
  }
}
