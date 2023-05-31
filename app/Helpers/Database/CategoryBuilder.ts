import { Builder } from '.'
import { Category } from 'App/Models'
import {RequestContract} from '@ioc:Adonis/Core/Request'
import { ModelQueryBuilderContract } from '@ioc:Adonis/Lucid/Orm'

export default class CategoryQuery extends Builder<ModelQueryBuilderContract<typeof Category, Category>> {
  constructor (protected $request: RequestContract) {
    super($request)

    this.mapQueries(this, Category.query())
  }
}
