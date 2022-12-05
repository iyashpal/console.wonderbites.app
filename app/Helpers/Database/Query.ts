import { User } from 'App/Models'
import { string } from '@ioc:Adonis/Core/Helpers'
import { RequestContract } from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default abstract class Query {
  public $query: any

  protected $user?: User

  protected $prefix: string

  protected $filters: string[] = []

  protected $counts: string[] = []

  protected $preloads: string[] = []

  protected $aggregates: string[] = []

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
    this.$user = user

    return this
  }

  /**
   * Get the current auth user.
   * 
   * @returns User
   */
  public user () {
    return this.$user ?? {} as User
  }

  /**
   * Get the main query instance.
   * 
   * @returns ModelQueryBuilderContract<any, any>
   */
  public abstract query (): ModelQueryBuilderContract<any, any>

  /**
   * Resolve the query filters, aggregates, counts, preload etc.
   * 
   * @returns ProductQuery
   */
  public resolveQuery () {
    return this
      .withCounts(this.$counts)
      .withFilters(this.$filters)
      .withPreloads(this.$preloads)
      .withAggregates(this.$aggregates)
  }

  public resolveQueryWithPrefix (prefix: string) {
    // Set the query string prefix.
    this.qsPrefix(prefix)

    // Resolve the query
    this.resolveQuery()

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
   * @param preloads string[]
   * @returns ProductQuery
   */
  public withPreloads (preloads: string[]) {
    for (let preload of preloads) {
      try {
        this[string.camelCase(`preload-${preload}`)]()
      } catch (error) {
        continue
      }
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
      try {
        this[string.camelCase(`filter-${filter}`)]()
      } catch (error) {
        continue
      }
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
      try {
        this[string.camelCase(`count-${count}`)]()
      } catch (error) {
        continue
      }
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
      try {
        this[string.camelCase(`aggregate-${aggregate}`)]()
      } catch (error) {
        continue
      }
    }

    return this
  }

  /**
   * Get the query params prefix.
   * 
   * @returns string
   */
  public qs (value: string = ''): string {
    return this.$prefix ? `${this.$prefix}.${value}`: value
  }

  /**
   * Get the request input.
   * 
   * @param key String
   * @param defaultValue Any
   * @returns Any
   */
  public input (key: string, defaultValue: any = null) {
    return this.$request.input(key, defaultValue)
  }
}
