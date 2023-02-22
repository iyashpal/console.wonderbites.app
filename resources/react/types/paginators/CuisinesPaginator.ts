import {Cuisine} from "@/types/models";
import {Paginator} from "@/types/paginators/index";

export default interface CuisinesPaginator extends Paginator {
  data: Cuisine[]
}
