import Category from "./Category";
import {IngredientProduct} from "./pivot";
import User from "./User";

export default interface Product {
  id: number,

  name: string,

  description: string,

  price: number,

  sku: string,

  thumbnail_url: string,

  status: number,

  created_at: string,

  user: User,

  categories?: Category[],

  ingredients?: IngredientProduct[],

  meta: {
    media_count?: number
  }
}
