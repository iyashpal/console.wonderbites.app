import Query from './Query'
import {Banner} from 'App/Models'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class BannerQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Banner, Banner>

  constructor (protected $request: RequestContract) {
    super($request)

    this.$query = Banner.query()

    this.$preloads.push(...['User'])

    this.$filters.push(...['Status', 'Page', 'Section', 'Type'])
  }

  /**
   * Get the query instance.
   *
   * @returns ModelQueryBuilderContract<typeof Product, Product>
   */
  public query (): ModelQueryBuilderContract<typeof Banner, Banner> {
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
      this.input('filters', []).includes('active'),
      query => query.apply(scopes => scopes.withActive()),
    ])

    return this
  }

  /**
   * Filter the advertisements based on page location.
   *
   * @returns AdvertisementQuery
   */
  protected filterPage (): this {
    this.$query.match([
      this.input('page'),
      query => query.whereJson('options', {page: this.input('page')}),
    ])

    return this
  }

  /**
   * Filter the advertisements based on section option.
   *
   * @returns AdvertisementQuery
   */
  protected filterSection (): this {
    this.$query.match([
      this.input('section'),
      query => query.whereJson('options', {section: this.input('section')}),
    ])

    return this
  }

  /**
   * Filter the advertisements based on type option.
   *
   * @returns AdvertisementQuery
   */
  protected filterType (): this {
    this.$query.match([
      this.input('type'),
      query => query.whereJson('options', {type: this.input('type')}),
    ])

    return this
  }
}
