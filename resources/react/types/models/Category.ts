import Cuisine from "./Cuisine";

export default interface Category {
  id: number,
  name: string,
  parent: number,
  description: string,
  type: string,
  status: number,
  created_at: string,
  updated_at: string,

  cuisines?: Cuisine[]
}
