import { User } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default abstract class Query {
  public $query: any

  protected $auth?: User

  protected $prefix: string

  constructor (
    protected $request: RequestContract
  ) { }

  /**
   * Set the authenticated user.
   * 
   * @param user User
   * @returns ProductQuery
   */
  public asUser (user: User) {
    this.$auth = user

    return this
  }

  /**
   * Set the query params prefix.
   * 
   * @param value
   * @returns Query 
   */
  public qsPrefix (value: string) {
    this.$prefix = value

    return this
  }

  /**
   * Define the user preloads.
   * 
   * @param filters string[]
   * @returns ProductQuery
   */
  public withPreloads (preloads: string[]) {
    for (let preload of preloads) {
      this[string.camelCase(`preload-${preload}`)]()
    }

    return this
  }

  /**
   * Apply filters to query builder.
   * 
   * @param filters String[]
   * @returns Query
   */
  public withFilters (filters: string[]) {
    for (let filter of filters) {
      this[string.camelCase(`filter-${filter}`)]()
    }

    return this
  }

  /**
   * Load the relation counts.
   * 
   * @param counts String[]
   * @returns Query
   */
  public withCounts (counts: string[]) {
    for (let count of counts) {
      this[string.camelCase(`count-${count}`)]()
    }

    return this
  }

  /**
   * Apply the query aggregates to builder.
   * 
   * @param aggregates String[]
   * @returns Query
   */
  public withAggregates (aggregates: string[]) {
    for (let aggregate of aggregates) {
      this[string.camelCase(`aggregate-${aggregate}`)]()
    }

    return this
  }

  /**
   * Get the query params prefix.
   * 
   * @returns string
   */
  public getPrefix (value: string = ''): string {
    return this.$prefix ? `${this.$prefix}.${value}`: value
  }
}
