import {Category} from "@/types/models";
import {Paginator} from '@/types/paginators';

export default interface CategoriesPaginator extends Paginator {
  data: Category[]
}
