import Category from "./Category";
import Ingredient from "./Ingredient";
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

  ingredients?: Ingredient[],

  meta: {
    media_count?: number
  }
}
