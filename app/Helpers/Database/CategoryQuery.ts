import { Query } from '.'
import { Category } from 'App/Models'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class CategoryQuery extends Query {
  public $query: ModelQueryBuilderContract<typeof Category, Category>

  constructor (protected $request: RequestContract) {
    super($request)

    this.$query = Category.query()

    this.$preloads.push(...[])

    this.$filters.push(...[])
  }

  /**
   * Get the query instance.
   *
   * @returns ModelQueryBuilderContract<typeof Category, Category>
   */
  public query (): ModelQueryBuilderContract<typeof Category, Category> {
    return this.$query
  }
}
