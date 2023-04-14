import {IngredientProduct} from "./pivot";
import {Category, Media, User} from "@/types/models";

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
  status: number,
  created_at: string,
  user: User,
  categories?: Category[],
  ingredients?: IngredientProduct[],
  media?: Media[],
  meta: {
    media_count?: number
  }
}
