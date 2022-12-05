import Query from './Query'
import { Advertisement } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class AdvertisementQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Advertisement, Advertisement>

  constructor (protected $request: RequestContract) {
    super($request)

    this.$query = Advertisement.query()

    this.$preloads.push(...['User'])

    this.$filters.push(...['Status', 'Location'])
  }

  /**
   * Get the query instance.
   * 
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  public query (): ModelQueryBuilderContract<typeof Advertisement, Advertisement> {
    return this.$query
  }

  /**
   * Preload the advertisements with creator data.
   * 
   * @returns AdvertisementQuery
   */
  protected preloadUser (): this {
    this.$query.match([
      this.input('with', []).includes(this.qs('user')),
      query => query.preload('user'),
    ])

    return this
  }

  /**
   * Filter advertisements by status.
   * 
   * @returns AdvertisementQuery
   */
  protected filterStatus (): this {
    this.$query.match([
      this.input('filters', []).includes(this.qs('status.active')),
      query => query.apply(scopes => scopes.withActive()),
    ])

    return this
  }

  /**
   * Filter the advertisements based on page location.
   * 
   * @returns AdvertisementQuery
   */
  protected filterLocation (): this {
    this.$query.match([
      this.input('location'),
      query => query.whereJson('options', {location: this.input('location')}),
    ])

    return this
  }
}
