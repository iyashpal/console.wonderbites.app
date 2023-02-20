import {Paginator} from './index';
import {Ingredient} from '@/types/models';

export default interface IngredientsPaginator extends Paginator {
  data: Ingredient[]
}
