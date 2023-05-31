import { User } from 'App/Models'
import { RequestContract } from '@ioc:Adonis/Core/Request'

type QueriesType =
  | 'where'
  | 'count'
  | 'filter'
  | 'preload'
  | 'aggregate'

export default abstract class Query<T> {
  public $builder: T

  protected $user?: User

  protected $queries: string[][]

  constructor (
    protected $request: RequestContract,
    protected $prefix?: string
  ) { }

  public static make ($request: RequestContract, $prefix?: string) {
    console.log(this)
    return this
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

  public run (): T {
    return this.query()
  }

  protected getQueries<InstanceType>(instance: InstanceType, queryName: QueriesType) {
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
      this.getQueries(instance, 'where'),
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
