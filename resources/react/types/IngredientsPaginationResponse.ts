import {Ingredient} from './models/index';
import {PaginationMeta} from './index';

export default interface IngredientsPaginationResponse {
  meta: PaginationMeta

  data: Ingredient[]
}
