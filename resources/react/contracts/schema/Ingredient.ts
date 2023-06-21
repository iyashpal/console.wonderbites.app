import {Category, User, Variant} from "@/contracts/schema/index";

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
  variants?: Variant[],
  meta: {
    pivot_category_id: number;
    pivot_price: number;
  }
}
