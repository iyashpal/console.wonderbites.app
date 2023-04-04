import { Order } from '~/types/models'
import Paginator from './Paginator'
export default interface UserPaginator extends Paginator {
  data: Order[]
}
