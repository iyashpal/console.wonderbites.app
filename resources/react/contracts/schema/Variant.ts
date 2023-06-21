import { Attribute, Category, Ingredient, User } from "@/contracts/schema/index";

export default interface Variant {
  id: number;
  user_id: number;
  name: string;
  description: string;
  price: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  user?: User;
  categories?: Category[];
  attributes?: Attribute[];
  ingredients?: Ingredient[],
  meta: {
    pivot_product_id: number;
    pivot_price: string;
  }
}
