import { User } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'

export default abstract class Query<T> {
  public $builder: T

  protected $user?: User

  protected $prefix: string

  protected $queries: string[][]

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
   * @returns ModelQueryBuilderContract<T, T>
   */
  public query (): T {
    return this.$builder
  }

  protected getQueries<InstanceType>(instance: InstanceType, queryName: 'count' | 'filter' | 'preload' | 'aggregate') {
    return Object
      .getOwnPropertyNames(
        Object.getPrototypeOf(instance)
      )
      .filter(name => name.startsWith(queryName))
  }

  protected mapQueries<InstanceType>(instance: InstanceType, query: T) {
    this.$builder = query

    this.$queries = [
      this.getQueries(instance, 'count'),
      this.getQueries(instance, 'filter'),
      this.getQueries(instance, 'preload'),
      this.getQueries(instance, 'aggregate'),
    ]
  }

  /**
   * Resolve the queries etc.
   *
   * @param prefix string | null
   */
  public resolve (prefix: string | null) {
    // Set the query string prefix.
    this.qsPrefix(prefix ?? '')

    // Resolve the query
    this.$queries.forEach(queries => {
      try {
        this.callQueriesFor(queries)
      } catch (error) {
        console.log(error)
      }
    })

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
   * call the given queries.
   *
   * @param queries string[]
   */
  public callQueriesFor (queries: string[]) {
    queries.forEach(query => {
      try {
        this[query]()
      } catch (error) {
        console.log(error)
      }
    })

    return this
  }

  /**
   * Get the query params prefix.
   *
   * @returns string
   */
  public qs (value: string = ''): string {
    return this.$prefix ? `${this.$prefix}.${value}` : value
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
