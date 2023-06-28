import { User } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'

type QueriesType =
  | 'where'
  | 'count'
  | 'filter'
  | 'preload'
  | 'aggregate'

export default abstract class Builder<T> {
  protected $user?: User

  protected $queries: string[][]

  constructor (
    protected $request: RequestContract,
    public $builder: T,
    protected $prefix?: string
  ) {
    this.mapQueries(this, $builder)
  }

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
   * Specify the auth user.
   *
   * @param user User
   * @returns Builder
   */
  public auth (user: User) {
    return this.asUser(user)
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
    return this.resolve().$builder
  }

  /**
   * Run or get the query.
   *
   * @returns ModelQueryBuilderContract<T, T>
   */
  public run (): T {
    return this.query()
  }

  /**
   * Get the list of queries available for the specified name.
   *
   * @param instance Builder
   * @param queryName query name
   * @returns array
   */
  protected getQueries<InstanceType>(instance: InstanceType, queryName: QueriesType) {
    return Object
      .getOwnPropertyNames(
        Object.getPrototypeOf(instance)
      )
      .filter(name => name.startsWith(queryName))
  }

  /**
   * Map the defined queries to the main query builder.
   *
   * @param instance Builder
   * @param query ModelQuery
   */
  protected mapQueries<InstanceType>(instance: InstanceType, query: T) {
    this.$builder = query

    this.$queries = [
      this.getQueries(instance, 'count'),
      this.getQueries(instance, 'where'),
      this.getQueries(instance, 'filter'),
      this.getQueries(instance, 'preload'),
      this.getQueries(instance, 'aggregate'),
    ]
  }

  /**
   * Resolve the queries, etc.
   *
   * @param prefix string | null
   */
  public resolve (prefix?: string) {
    // Set the query string prefix.
    this.qsPrefix(prefix)

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
  public qsPrefix (value?: string) {
    this.$prefix = value ?? this.$prefix

    return this
  }

  /**
   * call the given queries.
   *
   * @param queries string[]
   */
  protected callQueriesFor (queries: string[]) {
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
   * Get the query params prefixed.
   *
   * @returns string
   */
  public __ (value: string = ''): string {
    return this.$prefix ? `${this.$prefix}.${value}` : value
  }

  /**
   * Get the request input.
   *
   * @param key String
   * @param defaultValue Any
   * @returns Any
   */
  public input<T> (key: string, defaultValue?: T): T {
    return this.$request.input(key, defaultValue)
  }

  public _includes (key: string, value: string, prefixedValue: boolean = true) {
    return this.input(key, [] as string[]).includes((prefixedValue ? this.__(value) : value))
  }

  /**
   * Get the selection columns for a param.
   *
   * @param param string
   * @param renderWithPrefix boolean
   * @returns string[]
   */
  public selectColumnsOf (param: string, renderWithPrefix: boolean = true): Array<string> {
    let fragment = this.input<string[]>('select', [])
      .find(item => item.startsWith(`${renderWithPrefix ? this.__(param) : param}:`))

    if (fragment) {
      let [columns] = fragment.split(':').reverse()

      return columns.split(',')
    }

    return ['*']
  }
}
