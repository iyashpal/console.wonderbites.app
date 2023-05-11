import {IngredientProduct} from "./pivot";
import {Category, Media, User, Variant} from "~/contracts/schema";

export default interface Product {
  id: number,
  name: string,
  description: string,
  price: number,
  sku: string,
  calories: string,
  thumbnail_url: string,
  is_popular: boolean,
  is_customizable: boolean,
  type: string,
  status: string,
  published_at: string,
  created_at: string,
  user: User,
  categories?: Category[],
  ingredients?: IngredientProduct[],
  variants?: Variant[],
  media?: Media[],
  meta: {
    media_count?: number
  }
}
