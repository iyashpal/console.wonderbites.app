import { Builder } from '.'
import {Banner} from 'App/Models'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import {ModelQueryBuilderContract} from '@ioc:Adonis/Lucid/Orm'

export default class BannerBuilder extends Builder<ModelQueryBuilderContract<typeof Banner, Banner>> {
  constructor (protected $request: RequestContract) {
    super($request)

    this.mapQueries(this, Banner.query())
  }

  /**
   * Preload the advertisements with creator data.
   *
   * @returns AdvertisementQuery
   */
  protected preloadUser () {
    this.$builder.match([
      this.input('with', [] as string[]).includes(this.qs('user')),
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
    this.$builder.match([
      this.input('filters', [] as string[]).includes('active'),
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
    this.$builder.match([
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
    this.$builder.match([
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
    this.$builder.match([
      this.input('type'),
      query => query.whereJson('options', {type: this.input('type')}),
    ])

    return this
  }
}
