import {Product} from './models/index';
import {PaginationMeta} from './index';

export default interface ProductsPaginationResponse {
  meta: PaginationMeta

  data: Product[]
}
