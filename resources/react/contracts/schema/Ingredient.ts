import {Category, User} from "@/contracts/schema/index";

export default interface Ingredient {
  id: number,

  name: string,

  description: string,

  sku: string,

  unit: string,

  quantity: number,

  minQuantity: number,

  maxQuantity: number,

  price: number,

  thumbnailUrl: string,

  publishedAt: string,

  created_at: string,

  status: string,
  user?: User,
  categories?: Category[],
  meta: {

  }
}
