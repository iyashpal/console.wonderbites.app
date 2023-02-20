import {Paginator} from './index';
import {Product} from '@/types/models/index';

export default interface ProductsPaginator extends Paginator{
  data: Product[]
}
